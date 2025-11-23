export interface ArticleContent {
  title: string;
  content: string;
  url: string;
  author?: string;
  publishedDate?: string;
  excerpt?: string;
}

export interface SEOSuggestion {
  issue: string;
  suggestion: string;
  sources: string[];
}

export interface SEOAnalysis {
  score: number;
  suggestions: SEOSuggestion[];
}

export interface FactualSuggestion {
  claim: string;
  issue: string;
  correction: string;
  sources: string[];
}

export interface FactualAnalysis {
  score: number;
  suggestions: FactualSuggestion[];
}

export interface AnalysisResult {
  article: ArticleContent;
  seo: SEOAnalysis;
  factual: FactualAnalysis;
}

export interface ErrorResponse {
  error: string;
  message: string;
}
