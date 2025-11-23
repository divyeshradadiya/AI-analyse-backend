import OpenAI from "openai";
import { config } from "../config";
import { ArticleContent, FactualAnalysis } from "../types";

export class FactCheckService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openRouter.apiKey,
      baseURL: config.openRouter.apiUrl,
    });
  }

  private async validateUrl(url: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        method: "HEAD",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  private async filterValidUrls(urls: string[]): Promise<string[]> {
    const validUrls = [];
    for (const url of urls) {
      if (await this.validateUrl(url)) {
        validUrls.push(url);
      }
    }
    // If no valid URLs, return the first one anyway
    return validUrls.length > 0 ? validUrls : [urls[0]].filter(Boolean);
  }

  async analyzeFactualAccuracy(
    article: ArticleContent
  ): Promise<FactualAnalysis> {
    const prompt = `You are an expert fact-checker and researcher. Analyze the following article for factual accuracy and currency of information.

Article Title: ${article.title}
Article URL: ${article.url}
Published Date: ${article.publishedDate || "Unknown"}
Article Content:
${article.content.substring(0, 4000)}

Provide a comprehensive fact-checking analysis with:
1. An overall factual accuracy score from 0 to 100
2. A list of specific claims that are incorrect, outdated, or require verification
3. For each issue, provide the correction and at least one authoritative source link (real URLs from academic sources, government websites, reputable news organizations, etc.)

Consider these factors:
- Factual claims and statistics
- Outdated information (especially for technology, science, regulations)
- Misleading statements or context
- Missing important disclaimers
- Verifiability of claims
- Source credibility

Return your response in the following JSON format:
{
  "score": <number from 0-100>,
  "suggestions": [
    {
      "claim": "<the problematic claim from the article>",
      "issue": "<what's wrong with it>",
      "correction": "<the accurate information>",
      "sources": ["<authoritative URL 1>", "<authoritative URL 2>"]
    }
  ]
}

If the article is factually accurate and up-to-date (score 95+), return an empty suggestions array.
Ensure all source URLs are real, authoritative, and directly relevant to the correction.
Today's date is November 22, 2025 - consider this when checking if information is current.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: config.openRouter.model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert fact-checker who provides accurate corrections with authoritative sources. You are thorough but fair in your assessments.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error("No response from AI service");
      }

      const analysis = JSON.parse(response);

      // Validate and sanitize the response
      const suggestions = await Promise.all(
        (analysis.suggestions || []).map(async (s: any) => {
          const validSources = await this.filterValidUrls(
            Array.isArray(s.sources) ? s.sources : []
          );
          return {
            claim: s.claim || "",
            issue: s.issue || "",
            correction: s.correction || "",
            sources: validSources,
          };
        })
      );

      return {
        score: Math.min(100, Math.max(0, analysis.score || 0)),
        suggestions,
      };
    } catch (error) {
      console.error("Fact Check Error:", error);
      throw new Error("Failed to analyze factual accuracy");
    }
  }
}
