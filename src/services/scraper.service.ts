import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import TurndownService from 'turndown';
import { ArticleContent } from '../types';

export class ScraperService {
  private turndownService: TurndownService;

  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      bulletListMarker: '-',
    });

    // Customize turndown to preserve tables
    this.turndownService.keep(['table', 'thead', 'tbody', 'tr', 'th', 'td']);
  }

  async scrapeArticle(url: string): Promise<ArticleContent> {
    try {
      // Fetch the HTML content
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 15000,
      });

      const html = response.data;

      // Parse with JSDOM
      const dom = new JSDOM(html, { url });
      const document = dom.window.document;

      // Use Readability to extract main content
      const reader = new Readability(document);
      const article = reader.parse();

      if (!article) {
        throw new Error('Failed to extract article content');
      }

      // Convert HTML to Markdown
      const markdown = this.turndownService.turndown(article.content);

      // Extract metadata
      const metaAuthor = document.querySelector('meta[name="author"]')?.getAttribute('content');
      const metaDate = document.querySelector('meta[property="article:published_time"]')?.getAttribute('content');

      return {
        title: article.title,
        content: markdown,
        url,
        author: article.byline || metaAuthor || undefined,
        publishedDate: metaDate || undefined,
        excerpt: article.excerpt || undefined,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch URL: ${error.message}`);
      }
      throw error;
    }
  }

  validateUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }
}
