# Product Management System

This project is a web-based product management system with two types of users: admin and manager. Admin users can create, update, delete, and retrieve a list of products, while manager users can only view the list of products. The system also includes a nodemailer feature for registration confirmation and implements socket.io for real-time product list updates.

## Features

- User Roles:
  - Admin: Create, update, delete, and retrieve products.
  - Manager: View the list of products.

- Nodemailer Integration:
  - Send registration confirmation emails to users.

- Socket.io Integration:
  - Real-time product list updates when changes are made by admin users.

## Prerequisites

Before getting started, ensure that you have the following prerequisites installed:

- Node.js and npm
- MongoDB (or any preferred database)

## Installation

1. Clone the repository:

2. Install dependencies:

3. Start the application:

## Usage

1. Access the application in your web browser.

2. Register an admin or manager account.

3. Log in using your credentials.

4. Admins can create, update, delete, and retrieve products.

5. Managers can view the list of products.

6. Registration confirmation emails will be sent upon successful registration.

7. Real-time product list updates will be visible when changes are made by admin users.

## Technology Stack

- Node.js
- Express.js
- MongoDB
- Nodemailer
- Socket.io
- bcryptjs
- jsonwebtoken
- async-redis
- body-parser
- cors
- dotenv
- http
- joi



## Acknowledgements

- Special thanks to the open-source community for providing tools and libraries used in this project.

