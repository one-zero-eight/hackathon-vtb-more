// src/hooks/useInterview.ts
import { $api } from '@/api';
import { useRef, useState } from 'react';

type SessionResp = {
  client_secret: string;
  expires_at: number;
  session_id: string;
};

export function useInterview() {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [status, setStatus] = useState<
    'idle' | 'connecting' | 'connected' | 'error'
  >('idle');
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcripts, setTranscripts] = useState<
    { role: string; message: string }[]
  >([]);

  // Safe status update function
  const safeSetStatus = (
    newStatus: 'idle' | 'connecting' | 'connected' | 'error'
  ) => {
    console.log(
      `Attempting to set status from ${status} to ${newStatus}, isConnected: ${isConnected}`
    );

    // Don't allow setting error status if we're already connected
    if (newStatus === 'error' && isConnected) {
      console.log(
        'Preventing error status override - connection is established'
      );
      return;
    }

    setStatus(newStatus);
  };

  async function startInterview() {
    try {
      console.log('Starting interview...');
      safeSetStatus('connecting');

      const token = localStorage.getItem('token');

      // 1) Get ephemeral token from backend
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `bearer ${token}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/interview/session?application_id=1`,
        {
          headers,
        }
      );
      console.log('Backend response status:', response.status);
      const data = await response.json();
      console.log('Backend response data:', data);
      const EPHEMERAL = data.value;

      // 2) Create PeerConnection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Add error handling for PeerConnection
      pc.onconnectionstatechange = () => {
        console.log('PeerConnection state:', pc.connectionState);
        if (pc.connectionState === 'failed' && !isConnected) {
          console.error('PeerConnection failed');
          safeSetStatus('error');
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', pc.iceConnectionState);
      };

      // 3) Handle incoming assistant audio
      pc.ontrack = e => {
        if (!audioRef.current) {
          audioRef.current = new Audio();
          audioRef.current.autoplay = true;
        }
        audioRef.current.srcObject = e.streams[0];

        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }
        const audioContext = audioContextRef.current;
      };

      // 4) Data channel for events
      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;
      dc.onmessage = msg => handleServerEvent(msg.data);
      dc.onerror = error => {
        console.error('Data channel error:', error);
      };
      dc.onopen = () => {
        console.log('Data channel opened');
        // Send initial event when data channel is ready
        console.log('Sending initial event...');
        sendEvent({
          type: 'response.create',
          response: {
            conversation: {
              transcribe_input_audio: true,
            },
          },
        });
        console.log('Initial event sent');
      };
      dc.onclose = () => {
        console.log('Data channel closed');
      };

      // 5) Get microphone input
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => pc.addTrack(t, stream));

      // 6) Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 7) Send offer to OpenAI Realtime API
      const resp = await fetch(`https://api.openai.com/v1/realtime/calls`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${EPHEMERAL}`,
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      });

      const answerSdp = await resp.text();
      console.log('OpenAI response status:', resp.status);
      console.log('Setting remote description...');
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
      console.log('Connection established, setting status to connected');
      setIsConnected(true);
      safeSetStatus('connected');
    } catch (e) {
      console.error('Interview start error:', e);
      safeSetStatus('error');
    }
  }

  function sendEvent(obj: unknown) {
    const msg = JSON.stringify(obj);
    console.log('Sending event:', obj);
    console.log('Data channel state:', dcRef.current?.readyState);
    if (dcRef.current?.readyState === 'open') {
      dcRef.current.send(msg);
      console.log('Event sent successfully');
    } else {
      console.error(
        'Data channel not ready, state:',
        dcRef.current?.readyState
      );
    }
  }

  let shouldEndConversation = false;

  function handleServerEvent(raw: string) {
    try {
      const evt = JSON.parse(raw);

      if (
        evt.type === 'conversation.item.input_audio_transcription.completed'
      ) {
        const userText = evt.transcript;
        setTranscripts(arr => [...arr, { role: 'user', message: userText }]);
        setIsListening(false);
      }

      if (evt.type === 'response.output_text.done') {
        const aiText = evt.text || evt.delta; // use evt.text if available, else evt.delta
        setTranscripts(arr => [...arr, { role: 'assistant', message: aiText }]);

        setIsSpeaking(false);
      }

      // AI's final audio transcript (if using audio output)
      if (evt.type === 'response.output_audio_transcript.done') {
        const aiText = evt.transcript;

        setTranscripts(arr => [...arr, { role: 'assistant', message: aiText }]);
        setIsSpeaking(false);

        if (evt.transcript.includes('<end_of_conversation>')) {
          console.log('AI requested conversation end after audio playback');
          shouldEndConversation = true;
        }
      }

      // Optionally: handle retrieved user message (if you use retrieval)
      if (evt.type === 'conversation.item.retrieved') {
        const userText = evt.item?.content?.[0]?.transcript;
        if (userText) {
          setTranscripts(arr => [...arr, { role: 'user', message: userText }]);
          setIsListening(false);
        }
      }

      if (evt.type === 'output_audio_buffer.stopped') {
        console.log('Audio buffer stopped');
        if (shouldEndConversation) {
          console.log('Stopping interview now...');
          stopInterview();
          shouldEndConversation = false;
        }
      }
    } catch (e) {
      console.error('Error parsing event:', e, 'Raw data:', raw);
    }
  }

  function stopInterview() {
    dcRef.current?.close();
    pcRef.current?.getSenders().forEach(s => s.track?.stop());
    pcRef.current?.close();
    audioContextRef.current?.close();
    dcRef.current = null;
    pcRef.current = null;
    audioContextRef.current = null;
    setIsConnected(false);
    safeSetStatus('idle');
  }

  // Логируем изменения транскрипта для отладки

  return {
    transcripts,
    status,
    transcript,
    isSpeaking,
    isListening,
    startInterview,
    stopInterview,
  };
}
