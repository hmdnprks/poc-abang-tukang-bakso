[![Production Deployment](https://github.com/hmdnprks/poc-abang-tukang-bakso/actions/workflows/production.yaml/badge.svg)](https://github.com/hmdnprks/poc-abang-tukang-bakso/actions/workflows/production.yaml)

# POC Abang Tukang Bakso

This is a location-based application built with Next.js, React, and Firebase. The application tracks the real-time location of customers and vendors (e.g., "Tukang Bakso") and displays them on an interactive map.

## Table of Contents

- [POC Abang Tukang Bakso](#poc-abang-tukang-bakso)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Project Structure](#project-structure)
  - [Environment Variables](#environment-variables)
  - [Available Scripts](#available-scripts)
  - [Technologies Used](#technologies-used)
  - [Security Best Practices](#security-best-practices)
  - [Learn More](#learn-more)

## Getting Started

First, clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/poc-abang-tukang-bakso.git
cd poc-abang-tukang-bakso
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

```bash
.env
[.env.local]
[.eslintrc.json]
.gitignore
.next/
[package.json]
public/
src/
  app/
  core/
    entities/
    repositories/
    services/
    usecases/
  data/
    datasources/
    repositories/
  infrastructure/
  presentation/
    components/
    hooks/
[tailwind.config.ts]
[tsconfig.json]
```

## Environment Variables

Create a `.env.local` file in the root directory and add your Firebase configuration:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
```

## Available Scripts

In the project directory, you can run:

```bash
npm run dev
```

Runs the app in the development mode. Open http://localhost:3000 to view it in the browser.

```bash
npm run build
```

Builds the app for production to the `.next` folder.

```bash
npm run start
```

Starts the production server.

```bash
npm run lint
```

Runs ESLint to check for linting errors.

## Technologies Used

- **Next.js**: A React framework for server-side rendering and static site generation.
- **React**: A JavaScript library for building user interfaces.
- **Firebase**: A platform for building web and mobile applications, providing real-time database, authentication, and hosting services.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Leaflet**: An open-source JavaScript library for mobile-friendly interactive maps.
- **React-Leaflet**: React components for Leaflet maps.
- **React Hook Form**: A library for managing form state and validation in React.
- **React Toastify**: A library for adding notifications to your React app.

## Security Best Practices

1. **Environment Variables**: Store sensitive information in environment variables.
2. **Firebase Security Rules**: Implement strict Firestore and Realtime Database security rules.
3. **Data Validation**: Validate data on both client and server sides.
4. **HTTPS**: Ensure all data transmission is encrypted using HTTPS.
5. **Content Security Policy (CSP)**: Implement CSP to prevent XSS attacks.
6. **Dependency Management**: Keep dependencies up to date and audit them regularly.
7. **Secure Headers**: Set secure HTTP headers.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.
