# ✨ MirTech: Full-Stack Project

This is a small, modern full-stack application orchestrated with **Docker Compose**, featuring a high-performance **FastAPI** backend and a reactive **Next.js** frontend powered by **Bun**. The entire application utilizes **Supabase** as its unified backend-as-a-service.

---

## 🚀 Getting Started (Quick)

The entire application stack (backend and frontend) can be launched with a single command, making local development seamless.

### Prerequisites

You must have **Docker Desktop** installed and running on your system.

### 1\. Configure Environment

Copy the provided `.env` configuration file and fill in your Supabase credentials. This file provides the necessary secrets for both the backend and frontend.

```bash
# From the project root (MirTech/)
cp .env.example .env
```

> ⚠️ **Important:** Update the `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in the newly created `.env` file.

### 2\. Launch the Application

Run this command from the project root directory (`MirTech/`):

```bash
docker compose up --build
```

| Command Part | Description                                                                                       |
| :----------- | :------------------------------------------------------------------------------------------------ |
| `up`         | Starts both the `backend` and `frontend` services.                                                |
| `--build`    | Compiles the Docker images from the `Dockerfile`s (necessary on first run or after code changes). |

---

## 🌐 Accessing the Services

Once the containers are successfully running, you can access the application through your web browser:

| Service                | Access URL                                               | Port Mapping                                   |
| :--------------------- | :------------------------------------------------------- | :--------------------------------------------- |
| **Frontend (Next.js)** | [http://localhost:3000](http://localhost:3000)           | `3000` (Host) $\rightarrow$ `3000` (Container) |
| **Backend (FastAPI)**  | [http://localhost:8000](http://localhost:8000)           | `8000` (Host) $\rightarrow$ `8000` (Container) |
| **Backend Docs**       | [http://localhost:8000/docs](http://localhost:8000/docs) |                                                |

---

## 🐳 Architecture Overview

The project is structured as a small **monorepo** and orchestrated via `docker-compose.yml` to ensure consistent development environments.

| Component    | Technology       | Directory      | Description                                                                                                                               |
| :----------- | :--------------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**  | FastAPI (Python) | `be/`          | Provides a REST API, handles authentication, and connects directly to Supabase using `SUPABASE_SERVICE_KEY`.                              |
| **Frontend** | Next.js (Bun)    | `fe/`          | A reactive web interface built with the App Router architecture. Uses **Bun** for rapid dependency management and running the dev server. |
| **Database** | Supabase         | N/A (External) | The hosted Postgres database, real-time API, and authentication provider.                                                                 |

---

## 💻 Backend Details (FastAPI)

The backend is responsible for all secure data operations.

### Key Files

- [`be/app/main.py`](https://github.com/tedhn/mirtech/blob/main/be/app/main.py): Initializes the FastAPI app, configures **CORS middleware**, and defines all API endpoints.
- [`be/app/models.py`](https://github.com/tedhn/mirtech/blob/main/be/app/models.py): Contains all Pydantic schemas for request validation and response shaping.
- [`be/app/helper.py`](https://github.com/tedhn/mirtech/blob/main/be/app/helper.py): Contains utility logic, such as `build_filtered_query` for constructing dynamic Supabase queries based on URL parameters.

### API Endpoints (Core User Routes)

| Method   | Path          | Function         | Description                                       |                                                                                |
| :------- | :------------ | :--------------- | :------------------------------------------------ | :----------------------------------------------------------------------------- |
| `GET`    | `/users`      | `get_users`      | Retrieves a paginated and filtered list of users. | [`be/app/main.py`](https://github.com/tedhn/mirtech/blob/main/be/app/main.py)  |
| `GET`    | `/users/{id}` | `get_user_by_id` | Retrieves a single user by ID.                    | [`be/app/main.py`](https://github.com/tedhn/mirtech/blob/main/be/app/main.pyy) |
| `POST`   | `/users`      | `create_user`    | Creates a new user record.                        | [`be/app/main.py`](https://github.com/tedhn/mirtech/blob/main/be/app/main.py)  |
| `PATCH`  | `/users/{id}` | `update_user`    | Partially updates a user record.                  | [`be/app/main.py`](https://github.com/tedhn/mirtech/blob/main/be/app/main.py)  |
| `DELETE` | `/users/{id}` | `delete_user`    | Deletes a user record.                            | [`be/app/main.py`](https://github.com/tedhn/mirtech/blob/main/be/app/main.py)  |

---

## 🎨 Frontend Details (Next.js + Bun)

The frontend is a standard Next.js application configured for fast development using Bun.

### Key Files

- [`fe/Dockerfile`](https://github.com/tedhn/mirtech/blob/main/fe/Dockerfile): Defines the build process, including the installation of **Bun**.
- [`fe/package.json`](https://github.com/tedhn/mirtech/blob/main/fe/package.json) / `bun.lockb`: Dependency manifest.
- [`fe/`](https://github.com/tedhn/mirtech/blob/main/fe): Contains all Next.js source files, pages, and components.

### Development Workflow

The `docker-compose.yml` mounts the local `fe/` folder, allowing for **Hot Module Replacement (HMR)**. Changes saved to your local Next.js files will automatically reflect in the browser without manual container restarts.

---

## 🧹 Stopping and Cleanup

To stop and remove the containers, network, and intermediate build artifacts:

```bash
docker compose down
```

## Why Supabase?

Supabase was chosen because it provides a modern, SQL-native backend that accelerates development while keeping the architecture simple, reliable, and scalable. The following reasons highlight why it was the ideal choice for this project:

1. Fully Managed PostgreSQL (Zero Setup)
   Supabase offers a production-ready Postgres database with migrations, schemas, triggers, and extensions enabled by default. This allowed me to focus entirely on application logic rather than configuring or maintaining database infrastructure.

2. Auto-Generated REST/Realtime APIs
   Every database table automatically exposes a powerful PostgREST API with advanced filters, pagination, and relational queries. This eliminated a lot of boilerplate backend code and significantly sped up development.

3. Integrated Auth + Row-Level Security
   Supabase Auth integrates tightly with Postgres and respects RLS policies, making it easy to build secure access rules right from the database layer. This is much more robust than manually building token middleware or custom ACL logic.

4. Realtime Subscription Support
   Supabase offers realtime updates powered by replication slots. Without needing to deploy WebSockets or external services, the app can react immediately to changes in the database—ideal for dashboards or rapidly updating UIs.

5. Excellent Developer Experience (DX)
   The Supabase CLI provides a smooth local development environment with commands for migrations, DB seeding, type generation, and running Auth/Storage locally. This made the development cycle extremely efficient.

## ⚡ Performance Optimization Techniques

Several techniques were employed to ensure fast compilation, low latency, and a quick developer feedback loop:

1. Bun Runtime: Using Bun dramatically speeds up dependency installation (bun install is faster than npm install) and script execution, which reduces overall Docker build and startup times.

2. Frontend Data Management (Tanstack Query): Client-side performance is heavily optimized using React Tanstack Query for data fetching. This library automatically handles powerful features like data caching, stale-while-revalidate logic, and request debouncing to minimize unnecessary network calls to the backend and improve UI responsiveness.

## 🎨 UI/UX Considerations

The user experience was prioritized with responsiveness and predictability:

Responsive Design: Using a utility-first CSS framework (e.g., Tailwind CSS, if adopted) or modern CSS ensures the application is fully responsive and usable across mobile, tablet, and desktop viewports.

Predictable Interactions: All forms and inputs are validated client-side where possible, and server responses (from FastAPI) use consistent Pydantic models, which ensures the UI always receives predictable, typed data, minimizing unexpected rendering issues.

Clear State Feedback: When creating, updating, or deleting resources, the UI should display clear loading states and success/error messages to manage user expectations during network latency.

## 🔮 Future Improvements (Reflection)

Given more time and scope, the two primary areas for improvement would be dedicated to optimizing the backend: enhanced security and superior performance.

1. Enhanced Security and Auth: I would prioritize implementing proper authentication and user roles into the FastAPI service. This means integrating with Supabase's built-in Auth system (JWTs) and replacing the current SUPABASE_SERVICE_KEY approach with user-specific tokens. Middleware would be added to protect every API route, ensuring data access is personalized and secure.

2. Superior Backend Performance (Query Optimization & Caching): I would focus heavily on improving overall API latency and query speed. This involves two steps: first, deep query optimization within the FastAPI service to ensure the most efficient database interactions with Supabase, specifically targeting complex filter/join operations. Second, I would introduce a robust backend caching layer using a service like Redis, integrated via Docker Compose. Caching frequently accessed, static, or slow-to-generate data at the FastAPI level would significantly reduce the load on the PostgreSQL database and drastically improve API throughput and query speed.
