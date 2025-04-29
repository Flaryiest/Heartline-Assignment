# Heartline Chat Application

A React Native mobile application for real-time chat and messaging.

## Project Structure

- `/app` - React Native application (Expo)
- `/api` - Go backend API (not currently used)

## Getting Started

### Frontend (React Native)

```bash
cd app
npm install
npm start
```

## Features

- User authentication
  - Register with name, email, and password
  - Login with email and password
  - Local user list for demonstration purposes
- Messaging
  - View list of conversations
  - Create new conversations
  - Send and receive messages
  - Real-time chat interface

## Tech Stack

- React Native with Expo
- Zustand for state management
- React Navigation for routing between screens
- NativeWind (Tailwind CSS for React Native)
- AsyncStorage for local data persistence