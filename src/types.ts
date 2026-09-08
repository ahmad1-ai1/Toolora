export type ToolCategory = 'images' | 'pdf' | 'text' | 'developer' | 'calculators';

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface RelatedLink {
  slug: string;
  anchorText: string;
  description: string;
}

export interface DetailedBenefit {
  title: string;
  description: string;
}

export interface ToolMetadata {
  id: string;
  slug: string;
  name: string;
  h1Title: string;
  seoTitle: string;
  metaDescription: string;
  shortDescription: string;
  longDescription: string;
  whatIsParagraphs: string[];
  whyUseDetailed: DetailedBenefit[];
  category: ToolCategory;
  iconName: string;
  isPopular?: boolean;
  keywords: string[];
  features: string[];
  howToSteps: string[];
  whyUse: string[];
  faqs: ToolFaq[];
  relatedToolSlugs: string[];
  relatedLinks?: RelatedLink[];
}

