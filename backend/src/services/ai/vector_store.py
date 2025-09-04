from src.services.ai.openai_client import OpenAIClient


class VectorStoreManager:
    def __init__(self, openai_client: OpenAIClient) -> None:
        self._client = openai_client.client

    def create_vector_store(self, file_path: str, *, name: str | None = "application_cv_store") -> str:
        vector_store = self._client.vector_stores.create(name=name)

        with open(file_path, "rb") as f:
            file_batch = self._client.vector_stores.file_batches.upload_and_poll(
                vector_store_id=vector_store.id,
                files=[f],
            )

        status = getattr(file_batch, "status", None)
        if status == "failed":
            raise RuntimeError(f"Vector store file batch failed: {getattr(file_batch, 'file_counts', None)}")

        return vector_store.id

    def delete_vector_store(self, vector_store_id: str) -> None:
        self._client.vector_stores.delete(vector_store_id=vector_store_id)
