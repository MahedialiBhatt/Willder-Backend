# Willder's Backend-Auth Application

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [API Endpoints](#api-endpoints)

## Getting Started

This project is based on Node.js + Firebase + Typescript + ExpressJS.

### Prerequisites

- Node.js (Version 18.0.0)
- Firebase Acount
- SendGrid account (Note: Forgot Password feature will not work without this, Other's will work.)

### Installation

Follow these steps to set up and run the project:

1. Clone the repository.
2. Open cloned folder in preferred code editor, ex. VSCode.
3. Change directory to `functions` in terminal by using this command: `cd functions`
4. Install npm dependencies: `npm install`
5. Create a `.env` file inside the `functions` copy keys from .env.example file
6. Add firebase-dev.json and firebase-prod.json (create project in firebase and get service account from there) in function/src/utils/
7. Build the project: ```npm run build```
8. Start the Firebase emulators: ```firebase emulators:start```

## API Endpoints

 - API Structure - localhost:5001/project-id/asia-northeast1/api
 - All APIs collection available in dev/postman/ folder
 - Ex. Base_url + endpoint

| Endpoint                         | Method | Description                            |
|----------------------------------|--------|----------------------------------------|
| `/api/auth/register`             | POST   | Register a new user.                   |
| `/api/auth/login`                | POST   | Log in an existing user.               |
| `/api/auth/logout`               | POST   | Log out the currently authenticated user. |
| `/api/auth/password/forgot`      | POST   | Request a password reset for the user's account. |
| `/api/auth/refresh`              | POST   | Refresh the access token.              |
| `/api/auth/password/reset`       | PUT    | Reset the password.                   |
| `/api/account/updateaccount`     | PUT    | Update the account information.       |
| `/api/account/password`          | PUT    | Update the password.                  |
| `/api/account/getaccountinfo`    | GET    | Get account information.              |

-----------------------------------------------------------------------------------------------
