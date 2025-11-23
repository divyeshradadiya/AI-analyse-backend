# Backend - AI Content Analyzer API

Express.js backend service for the AI Content Analyzer application with TypeScript and comprehensive AI-powered analysis.

## Features

- **Article Content Extraction** using Mozilla Readability for clean, ad-free content
- **SEO Analysis** powered by xAI's Grok-4.1-fast model with authoritative source validation
- **Factual Accuracy Checking** with AI-driven corrections and reliable sources
- **RESTful API Architecture** with proper error handling and validation
- **TypeScript** for type safety and better maintainability
- **Router-Controller-Service Pattern** for clean, modular code organization
- **Source URL Validation** ensuring all suggestions link to accessible, relevant sources

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18.x
- **Language**: TypeScript 5.3.x
- **Content Extraction**: @mozilla/readability, jsdom, turndown
- **AI Service**: OpenRouter with xAI's Grok-4.1-fast model
- **Environment**: dotenv for configuration
- **Development**: ts-node-dev for hot reload, ESLint, Prettier

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

The server will start on `http://localhost:3001`

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# OpenRouter AI Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

**Required:**

- `OPENROUTER_API_KEY` - Your OpenRouter API key for AI analysis

**Optional:**

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment mode (default: development)
- `CORS_ORIGIN` - Allowed frontend origin (default: http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (TypeScript compilation)
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3001
NODE_ENV=development
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## API Endpoints

### POST /api/analyze

Analyzes an article URL for SEO and factual accuracy.

**Request Body:**

```json
{
  "url": "https://example.com/article"
}
```

**Response:**

```json
{
  "article": {
    "title": "Article Title",
    "content": "# Markdown content...",
    "url": "https://example.com/article",
    "author": "Author Name",
    "publishedDate": "2024-01-01T00:00:00.000Z",
    "excerpt": "Article excerpt..."
  },
  "seo": {
    "score": 85,
    "suggestions": [
      {
        "issue": "Title too short",
        "suggestion": "Expand title to 50-60 characters",
        "sources": [
          "https://developers.google.com/search/docs/fundamentals/seo-starter-guide"
        ]
      }
    ]
  },
  "factual": {
    "score": 92,
    "suggestions": [
      {
        "claim": "AI will replace all jobs by 2030",
        "issue": "Overstated timeline",
        "correction": "AI will significantly impact jobs but complete replacement is unlikely by 2030",
        "sources": [
          "https://www.mckinsey.com/business-functions/mckinsey-digital/our-insights/the-state-of-ai-in-2023"
        ]
      }
    ]
  }
}
```

### GET /api/health

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "service": "AI Content Analyzer API"
}
```

## Project Structure

```
src/
├── config/
│   └── index.ts           # Configuration management
├── controllers/
│   └── analyzer.controller.ts  # Request handlers
├── routes/
│   └── index.ts           # API route definitions
├── services/
│   ├── scraper.service.ts     # Article content extraction
│   ├── seo.service.ts         # SEO analysis with AI
│   └── factcheck.service.ts   # Factual accuracy checking
├── types/
│   └── index.ts           # TypeScript type definitions
└── index.ts               # Application entry point
```

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
