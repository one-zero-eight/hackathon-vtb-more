# AI-HR
> by one-zero-eight

http://31.56.222.234/


## 💡 Idea

The project is an **automated recruitment system powered by artificial intelligence.** Its goal is to reduce the time required for hiring and minimize subjectivity in the decision-making process. The AI pipeline includes resume analysis and a voice-based interview with the candidate.

## 🔧 Tech Stack

[![Python][Python]][Python-url]
[![FastAPI][FastAPI]][FastAPI-url]
[![PostgreSQL][PostgreSQL]][PostgreSQL-url]
[![Docker][Docker]][Docker-url]
[![Docker Compose][Docker-Compose]][Docker-Compose-url]
[![Nginx][Nginx]][nginx-url]

[![React][React]][react-url]
[![Vite][Vite]][vite-url]
[![TypeScript][TypeScript]][ts-url]
[![Tailwind][Tailwind CSS]][Tailwind-url]
[![ShadCN UI][Shadcnui]][shadcn-url]
[![pnpm][pnpm]][pnpm-url]
[![Prettier][prettier]][prettier-url]

## 🚀 How to Run the Project

### Development Mode

**Backend**

1. Install dependencies:
```
uv sync
```

2. Copy and configure settings:

```
cp settings.example.yaml settings.yaml
```

Edit settings.yaml according to your environment (see settings.schema.yaml
 for details).

3. Start the backend server:

```
cd backend
uv run -m src.api --reload
```

> **Note:** For endpoints requiring authorization, use the Authorize button in Swagger UI.

**Frontend**

1. Install dependencies:
```
pnpm install
```

Start the frontend development server:
```
pnpm start
```

### Production Mode

This mode uses Docker Compose to run both backend and frontend together.

1. Copy the settings:
```
cp settings.example.yaml settings.yaml
```

2. Adjust settings.yaml for production (refer to settings.schema.yaml
).

3. Build and start the services:
```
docker compose up --build -d
```

4. Access the application via the server's configured domain or IP.

## 🧩 Components

| Name     | Description                                         | More Info                                       |
|--------------|--------------------------------------------------|-------------------------------------------------|
| **Frontend** | React interface providing voice interaction | 📄 [`frontend/README.md`](./frontend/README.md) |
| **Backend**  | FastAPI service with REST API and integration with external AI APIs      | 📄 [`backend/README.md`](./backend/README.md)   |



## 👥 Team members

[one-zero-eight team](https://github.com/one-zero-eight)

| Team member                                                        | Contribution                                                                            |
|------------------------------------------------------------------|----------------------------------------------------------------------------------|
| [Stillah](https://github.com/Stillah)                          | Backend: creating endpoints                     |
| [ZolotarevAlexandr](https://github.com/ZolotarevAlexandr)        | Backend + ML: architecture and external APIs                        |
| [belyakova-anna](https://github.com/belyakova-anna)              | Frontend: page design and development                                        |
| [projacktor](https://github.com/projacktor)             | DevOps: project deployment |


[Python]: https://img.shields.io/badge/Python-000000?style=for-the-badge&logo=python

[Python-url]: https://www.python.org/

[FastAPI]: https://img.shields.io/badge/FastAPI-000000?style=for-the-badge&logo=fastapi

[FastAPI-url]: https://fastapi.tiangolo.com/

[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-000000?style=for-the-badge&logo=postgresql

[PostgreSQL-url]: https://www.postgresql.org/

[Vite]: https://img.shields.io/badge/Vite-000000?style=for-the-badge&logo=vite

[Vite-url]: https://vite.dev/

[RHF]: https://img.shields.io/badge/React_Hook_Form-000000?style=for-the-badge&logo=reacthookform

[rhf-url]: https://react-hook-form.com/

[Nginx]: https://img.shields.io/badge/Nginx-000000?style=for-the-badge&logo=nginx

[nginx-url]: https://nginx.org/

[lldap-url]: https://github.com/lldap/lldap

[Python]: https://img.shields.io/badge/Python_3.12-000000?style=for-the-badge&logo=python

[Python-url]: https://www.python.org/downloads/

[uv]: https://img.shields.io/badge/uv-000000?style=for-the-badge&logo=python

[uv-url]: https://github.com/astral-sh/uv

[FastAPI]: https://img.shields.io/badge/FastAPI-000000?style=for-the-badge&logo=fastapi

[FastAPI-url]: https://fastapi.tiangolo.com/

[Pydantic]: https://img.shields.io/badge/Pydantic-000000?style=for-the-badge&logo=pydantic

[Pydantic-url]: https://docs.pydantic.dev/latest/

[MWS-GPT-API]: https://img.shields.io/badge/MWS_GPT_API-000000?style=for-the-badge&logo=openai

[MWS-GPT-API-url]: https://api.gpt.mws.ru/

[LangChain]: https://img.shields.io/badge/LangChain-000000?style=for-the-badge&logo=langchain

[LangChain-url]: https://www.langchain.com/

[Ruff]: https://img.shields.io/badge/Ruff-000000?style=for-the-badge&logo=ruff

[Ruff-url]: https://docs.astral.sh/ruff/

[pre-commit]: https://img.shields.io/badge/pre--commit-000000?style=for-the-badge&logo=pre-commit

[pre-commit-url]: https://pre-commit.com/

[Docker]: https://img.shields.io/badge/Docker-000000?style=for-the-badge&logo=docker

[Docker-url]: https://www.docker.com/

[Docker-Compose]: https://img.shields.io/badge/Docker_Compose-000000?style=for-the-badge&logo=docker

[Docker-Compose-url]: https://docs.docker.com/compose/

[NextJS]: https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white

[Next-url]: https://nextjs.org/

[Tailwind CSS]: https://img.shields.io/badge/tailwind-000000?style=for-the-badge&logo=tailwindCSS

[Tailwind-url]: https://tailwindcss.com/

[pnpm]: https://img.shields.io/badge/pnpm-000000.svg?style=for-the-badge&logo=pnpm&logoColor=f69220

[pnpm-url]: https://pnpm.io/

[TypeScript]: https://img.shields.io/badge/typescript-000000.svg?style=for-the-badge&logo=typescript&logoColor=white

[ts-url]: https://www.typescriptlang.org/

[Shadcnui]: https://img.shields.io/badge/shadcn/ui-000000.svg?style=for-the-badge&2F&logo=shadcnui&color=131316

[shadcn-url]: https://ui.shadcn.com/

[json]: https://img.shields.io/badge/json-000000.svg?style=for-the-badge&logo=json&logoColor=white

[json-url]: https://www.json.org/json-en.html

[React]: https://img.shields.io/badge/react-000000.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB

[react-url]: https://react.dev/

[react-query]: https://img.shields.io/badge/React_Query-000000.svg?style=for-the-badge&logo=ReactQuery&logoColor=white


[prettier]: https://img.shields.io/badge/prettier-000000.svg?style=for-the-badge&logo=prettier&logoColor=F7BA3E

[prettier-url]: https://prettier.io/