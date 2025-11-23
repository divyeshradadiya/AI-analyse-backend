# Backend - AI Content Analyzer API

Express.js backend service for the AI Content Analyzer application.

## Features

- Article content extraction using Mozilla Readability
- SEO analysis using AI (OpenRouter)
- Factual accuracy checking using AI
- RESTful API architecture
- TypeScript for type safety
- Router-Controller-Service pattern

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env and add your OpenRouter API key
# Get one at: https://openrouter.ai/keys

# Start development server
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### POST /api/analyze
Analyzes an article URL for SEO and factual accuracy.

**Request Body:**
```json
{
  "url": "https://example.com/article"
}
```

**Response:** Returns complete analysis with scores and suggestions.

### GET /api/health
Health check endpoint.

## Environment Variables

See `.env.example` for all configuration options.

Required:
- `OPENROUTER_API_KEY` - Your OpenRouter API key

## Architecture

```
src/
├── config/          # Configuration management
├── controllers/     # Request handlers
├── routes/          # API route definitions
├── services/        # Business logic
│   ├── scraper.service.ts
│   ├── seo.service.ts
│   └── factcheck.service.ts
├── types/           # TypeScript type definitions
└── index.ts         # Application entry point
```
