import { Request, Response } from "express";
import { ScraperService } from "../services/scraper.service";
import { SEOService } from "../services/seo.service";
import { FactCheckService } from "../services/factcheck.service";
import { AnalysisResult, ErrorResponse } from "../types";

export class AnalyzerController {
  private scraperService: ScraperService;
  private seoService: SEOService;
  private factCheckService: FactCheckService;

  constructor() {
    this.scraperService = new ScraperService();
    this.seoService = new SEOService();
    this.factCheckService = new FactCheckService();
  }

  analyzeArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { url } = req.body;

      // Validate URL
      if (!url || typeof url !== "string") {
        res.status(400).json({
          error: "Bad Request",
          message: "URL is required and must be a string",
        } as ErrorResponse);
        return;
      }

      if (!this.scraperService.validateUrl(url)) {
        res.status(400).json({
          error: "Bad Request",
          message:
            "Invalid URL format. Please provide a valid HTTP or HTTPS URL.",
        } as ErrorResponse);
        return;
      }

      // Step 1: Scrape article content
      console.log(`[Analyzer] Scraping article from: ${url}`);
      const article = await this.scraperService.scrapeArticle(url);

      // Step 2: Analyze SEO in parallel with fact-checking
      console.log(`[Analyzer] Analyzing SEO and factual accuracy...`);
      const [seoAnalysis, factualAnalysis] = await Promise.all([
        this.seoService.analyzeSEO(article),
        this.factCheckService.analyzeFactualAccuracy(article),
      ]);

      // Step 3: Compile results
      const result: AnalysisResult = {
        article,
        seo: seoAnalysis,
        factual: factualAnalysis,
      };

      console.log(
        `[Analyzer] Analysis complete. SEO: ${seoAnalysis.score}, Factual: ${factualAnalysis.score}`
      );
      res.json(result);
    } catch (error) {
      console.error("[Analyzer] Error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      res.status(500).json({
        error: "Internal Server Error",
        message: errorMessage,
      } as ErrorResponse);
    }
  };

  healthCheck = async (req: Request, res: Response): Promise<void> => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "AI Content Analyzer API",
    });
  };
}
