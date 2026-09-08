export type ToolCategory = 'images' | 'pdf' | 'text' | 'developer' | 'calculators';

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolMetadata {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  category: ToolCategory;
  iconName: string;
  isPopular?: boolean;
  keywords: string[];
  features: string[];
  howToSteps: string[];
  whyUse: string[];
  faqs: ToolFaq[];
  relatedToolSlugs: string[];
}
