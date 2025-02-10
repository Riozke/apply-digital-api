# Project Documentation

This project requires the following steps to set up and run locally.

## Prerequisites

Before starting, ensure that you have Docker installed on your local environment. If Docker is not installed, follow these steps:

### Docker Installation

- **For macOS**: 
    - [Download Docker Desktop for macOS](https://www.docker.com/products/docker-desktop)
    - Install the application and follow the on-screen instructions.

- **For Windows**: 
    - [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
    - Install the application and follow the on-screen instructions.

- **For Linux**: 
    - Follow the [official Docker installation guide for Linux](https://docs.docker.com/engine/install/).

Once Docker is installed, ensure it is running before proceeding with the following steps.

## Installation Steps

1. **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2. **Install dependencies**:
    Run the following command to install all necessary dependencies:
    ```bash
    npm ci
    ```
    Alternatively, if you're using an older version of npm, you can use:
    ```bash
    npm install
    ```

3. **Generate a token to access protected endpoints**:
    - Use the login endpoint to generate an authentication token for protected endpoints:
    ```bash
    POST {url}/auth/login
    ```
    - The response will include a token that you can use to make authenticated requests.
    
    - Additionally, run the following endpoint to fetch products from the Contentful API:
    ```bash
    GET {URL}/products/manual-fetch
    ```

4. **Simulate Authorization with Permissions**:
    You can simulate authorization using the user credentials stored in the following file:
    ```plaintext
    src/data/users.json
    ```
    This file contains the email addresses and passwords for users (both admin and regular). Use these credentials to generate the token for the respective user role.

5. **Environment Variables**:
    An example of the required `.env` file is provided in `.env.example`. Copy the contents to a `.env` file in the root directory of the project and adjust the environment-specific values.

## API Documentation

You can find detailed documentation for the available API endpoints at the following URL:
{url}/api/docs#/

## Contributors 👑

<a href="https://https://github.com/Riozke/apply-digital-api/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Riozke/apply-digital-api" />
</a>
