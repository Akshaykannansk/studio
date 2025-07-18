# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running with Docker Compose

This project is configured to run with Docker Compose.

1.  Make sure you have Docker installed and running.
2.  From the root of the project, run the following command:

    ```bash
    docker-compose up --build
    ```

This will start three services:
- **next-app**: The Next.js application, available at [http://localhost:3000](http://localhost:3000).
- **postgres-db**: The PostgreSQL database server.
- **pgadmin**: The pgAdmin 4 administration tool, available at [http://localhost:5050](http://localhost:5050).
    - **Login Email:** `admin@example.com`
    - **Login Password:** `password`
    - You will need to add a server connection in pgAdmin to connect to `postgres-db`.
