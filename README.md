# Website Converter

A modern web application for converting websites to React and Tailwind CSS using AI and WebContainers.

## Features

- **Clerk Authentication**: Secure authentication using Clerk
- **Convex Database**: Real-time database for storing website conversion data
- **Azure AI Inference**: AI-powered code generation and website analysis
- **WebContainers**: Run generated code directly in the browser

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Clerk account
- A GitHub token for AI features

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Copy `.env.example` to `.env.local` and fill in the required environment variables:

```bash
cp .env.example .env.local
```

4. Update the following environment variables in `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `CLERK_SECRET_KEY`: Your Clerk secret key
   - `GITHUB_TOKEN`: Your GitHub token for Azure AI Inference

### Development

Run the development server:

```bash
# Start Convex in a separate terminal
npx convex dev

# Start Next.js
npm run dev
```

## Usage

1. **Login**: Sign in with your Clerk credentials
2. **AI Playground**: Use the AI Playground to generate code or analyze websites
3. **Dashboard**: View and manage your website conversion projects

## Project Structure

- `/app`: Next.js App Router pages
- `/components`: React components
- `/convex`: Convex database schema and functions
- `/lib`: Utility functions and hooks
  - `/lib/aiInference.ts`: Azure AI Inference client
  - `/lib/systemPrompt.ts`: System prompt for AI
  - `/lib/webContainers.ts`: WebContainer service

## License

MIT
