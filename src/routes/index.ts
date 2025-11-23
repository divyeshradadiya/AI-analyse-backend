import { Router } from 'express';
import { AnalyzerController } from '../controllers/analyzer.controller';

const router = Router();
const analyzerController = new AnalyzerController();

/**
 * @route   POST /api/analyze
 * @desc    Analyze an article URL for SEO and factual accuracy
 * @access  Public
 */
router.post('/analyze', analyzerController.analyzeArticle);

/**
 * @route   GET /api/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', analyzerController.healthCheck);

export default router;
