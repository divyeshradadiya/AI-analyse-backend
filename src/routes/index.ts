import { Router } from "express";
import {
  analyzeArticle,
  healthCheck,
} from "../controllers/analyzer.controller";

const router = Router();

/**
 * @route   POST /api/analyze
 * @desc    Analyze an article URL for SEO and factual accuracy
 * @access  Public
 */
router.post("/analyze", analyzeArticle);

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get("/health", healthCheck);

export default router;
