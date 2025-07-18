# FilmFriend: A Next.js Movie Application

This is a Next.js starter application for FilmFriend, a platform to discover, track, and share movies. It's built with Next.js, React, ShadCN UI, and Tailwind CSS, all running inside Docker containers.

## Running with Docker Compose

This project is configured to run with Docker Compose, which orchestrates all the necessary services.

### Prerequisites

*   [Docker](https://www.docker.com/products/docker-desktop/) must be installed and running on your system.

### Steps to Run

1.  **Clone the repository** (if you haven't already).
2.  **Navigate to the project root directory** in your terminal.
3.  **Build and start the services** by running the following command:
    ```bash
    docker-compose up --build -d
    ```
    *   `--build` tells Docker to rebuild the images if the `Dockerfile` has changed.
    *   `-d` runs the containers in detached mode (in the background).

### Accessing the Services

Once the containers are running, you can access the different parts of the application:

*   **Next.js Web App**: [http://localhost:3000](http://localhost:3000)
*   **pgAdmin (Database Admin Tool)**: [http://localhost:5050](http://localhost:5050)
    *   **Login Email**: `admin@example.com`
    *   **Login Password**: `password`
    *   To connect to the database in pgAdmin, you will need to add a new server with the hostname `postgres-db`. The username is `user` and the password is `password`.

### Stopping the Application

To stop all the running containers, run the following command from the project root:

```bash
docker-compose down
```
