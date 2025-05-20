# Website Converter

[![GitHub Repo](https://img.shields.io/badge/GitHub-urban--octo--spork-blue?logo=github)](https://github.com/otdoges/urban-octo-spork)

Website Converter is a modern web application that analyzes, converts, and customizes website designs. Built with Next.js, Tailwind CSS, and TypeScript, it provides tools for extracting color palettes, editing typography, previewing screenshots, and more.

## Features

- Analyze website content and extract color palettes
- Screenshot and preview websites
- Edit and customize color schemes and typography
- Dashboard for managing results
- Modern UI with reusable components
- Backend powered by Convex

## Tech Stack

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Convex](https://convex.dev/) (backend)
- [Radix UI](https://www.radix-ui.com/) components
- [Clerk](https://clerk.com/) authentication

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/otdoges/urban-octo-spork.git
   cd website-converter
   ```
2. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

### Running the App

Start the development server:
```sh
pnpm dev
# or
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Main application pages and API routes
- `components/` - UI and functional React components
- `convex/` - Backend logic and Convex configuration
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and libraries
- `providers/` - Context providers
- `public/` - Static assets
- `styles/` - Global styles

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)