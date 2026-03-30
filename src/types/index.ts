export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  role: string;
  twitter_url: string | null;
  linkedin_url: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  icon: string | null;
  sort_order: number;
  created_at: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  image_caption: string | null;
  category_id: string;
  subcategory_id: string | null;
  author_id: string;
  locale: "fr" | "en";
  status: "draft" | "published" | "archived";
  is_featured: boolean;
  is_breaking: boolean;
  is_exclusive: boolean;
  read_time: number;
  published_at: string | null;
  updated_at: string;
  created_at: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[] | null;
  // Relations
  category?: Category;
  subcategory?: Subcategory;
  author?: Author;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Comment {
  id: string;
  article_id: string;
  author_name: string;
  author_initials: string;
  content: string;
  parent_id: string | null;
  is_approved: boolean;
  created_at: string;
  replies?: Comment[];
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  locale: "fr" | "en";
  is_active: boolean;
  subscribed_at: string;
}

export interface ArticleWithRelations extends Article {
  category: Category;
  author: Author;
  subcategory?: Subcategory;
}
