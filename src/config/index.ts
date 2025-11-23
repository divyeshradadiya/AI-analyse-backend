import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3002,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY || "",
    apiUrl: process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1",
    model: process.env.AI_MODEL || "x-ai/grok-4.1-fast",
  },
};

export const validateConfig = () => {
  if (!config.openRouter.apiKey) {
    throw new Error("OPENROUTER_API_KEY is required in environment variables");
  }
};
