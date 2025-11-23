import OpenAI from "openai";
import { config } from "../config";
import { ArticleContent, SEOAnalysis } from "../types";

export class SEOService {
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

  async analyzeSEO(article: ArticleContent): Promise<SEOAnalysis> {
    const prompt = `You are an expert SEO analyst. Analyze the following article for SEO optimization.

Article Title: ${article.title}
Article URL: ${article.url}
Article Content:
${article.content.substring(0, 4000)}

Provide a comprehensive SEO analysis with:
1. An overall SEO score from 0 to 100
2. A list of specific, actionable improvement suggestions (if any)
3. For each suggestion, provide at least one authoritative source link (real URLs from Google SEO guidelines, Moz, Search Engine Journal, etc.)

Consider these SEO factors:
- Title optimization (length, keywords, clarity)
- Content structure (headings, paragraphs)
- Keyword usage and density
- Meta description potential
- Content length and depth
- Internal/external linking opportunities
- Readability and user experience
- Mobile optimization considerations
- Image optimization (alt text mentions)

Return your response in the following JSON format:
{
  "score": <number from 0-100>,
  "suggestions": [
    {
      "issue": "<what's wrong>",
      "suggestion": "<specific actionable fix>",
      "sources": ["<authoritative URL 1>", "<authoritative URL 2>"]
    }
  ]
}

If the article is already well-optimized (score 95+), return an empty suggestions array.
Ensure all source URLs are real and relevant.`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: config.openRouter.model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert SEO analyst who provides detailed, actionable feedback with authoritative sources.",
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
            issue: s.issue || "",
            suggestion: s.suggestion || "",
            sources: validSources,
          };
        })
      );

      return {
        score: Math.min(100, Math.max(0, analysis.score || 0)),
        suggestions,
      };
    } catch (error) {
      console.error("SEO Analysis Error:", error);
      throw new Error("Failed to analyze SEO");
    }
  }
}
