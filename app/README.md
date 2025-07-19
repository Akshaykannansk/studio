# FilmFriend: A Next.js Movie Application (Frontend)

This is the Next.js frontend for FilmFriend, a platform to discover, track, and share movies. It's built with Next.js, React, ShadCN UI, and Tailwind CSS.

This application is designed to be the **frontend only**. All backend logic (database, AI, user management) is intended to be handled by a separate backend service, such as a FastAPI application.

## Running with Docker Compose

This project is configured to run with Docker Compose, which orchestrates the frontend service.

### Prerequisites

*   [Docker](https://www.docker.com/products/docker-desktop/) must be installed and running on your system.

### Steps to Run

1.  **Clone the repository** (if you haven't already).
2.  **Navigate to the project root directory** in your terminal.
3.  **Build and start the services** by running the following command:
    ```bash
    docker-compose up --build -d
    ```
    *   `--build` tells Docker to rebuild the image if the `Dockerfile` has changed.
    *   `-d` runs the container in detached mode (in the background).

### Accessing the App

Once the container is running, you can access the Next.js web app at:

*   **Next.js Web App**: [http://localhost:3000](http://localhost:3000)

### Stopping the Application

To stop the running container, run the following command from the project root:

```bash
docker-compose down
```
