// src/App.tsx

import { useInterview } from '@/hooks/useInterview';
import { Button } from '../ui/button';
import { $api } from '@/api';
import Orb from '../Orb';
import { useEffect } from 'react';

function App() {
  const { status, transcript, transcripts, startInterview, stopInterview } =
    useInterview();

  console.log(transcripts);
  return (
    <div className="w-screen -mt-16 h-screen gap-40 flex flex-col items-center justify-center">
      {status === 'connected' && (
        <div className="flex flex-col items-center gap-8">
          <Orb />
          <Button
            onClick={stopInterview}
            className="text-lg px-8 py-4 cursor-pointer"
          >
            Stop Interview
          </Button>
        </div>
      )}

      <div className="fixed bottom-4 left-4 right-4 max-h-64 overflow-y-auto bg-black/50 text-white p-4 rounded-lg">
        <div className="space-y-2">
          {transcripts.map((t, index) => (
            <div
              key={index}
              className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  t.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-600 text-white'
                }`}
              >
                <div className="text-xs opacity-70 mb-1">
                  {t.role === 'user' ? 'Вы' : 'Ассистент'}
                </div>
                <div>{t.message}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {status === 'idle' && (
        <Button
          onClick={startInterview}
          className="text-lg px-8 py-4 cursor-pointer"
        >
          Start Interview
        </Button>
      )}

      {status === 'connecting' && <div className="text-lg">Connecting...</div>}

      {status === 'error' && (
        <div className="text-lg text-red-500">Connection Error</div>
      )}
    </div>
  );
}

export default App;
