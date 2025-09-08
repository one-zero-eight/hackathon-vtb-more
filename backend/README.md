## How to run backend
1. Install [Python 3.12+](https://www.python.org/downloads/), [uv](https://docs.astral.sh/uv/), [Docker](https://docs.docker.com/engine/install/).
2. Install project dependencies with [uv](https://docs.astral.sh/uv/cli/#install).
   ```bash
   uv sync
   ```
3. Copy settings.example.yaml to settings.yaml and add token:
   ```bash
   cp settings.example.yaml settings.yaml
   ```
5. Start development server:
   ```bash
   cd backend
   uv run -m src.api --reload
   ```

> [!IMPORTANT]
> For endpoints requiring authorization, click "Authorize" button in Swagger UI!

> [!TIP]
> Edit `settings.yaml` according to your needs, you can view schema in [settings.schema.yaml](settings.schema.yaml).

### Deployment
We use Docker with Docker Compose plugin to run the service on servers.

1. Copy the file with settings: `cp settings.example.yaml settings.yaml`.
2. Change settings in the `settings.yaml` file according to your needs
   (check [settings.schema.yaml](settings.schema.yaml) for more info).
3. Install Docker with Docker Compose.
4. Build and run docker container: `docker compose up --build`.
