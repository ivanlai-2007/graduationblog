export enum Language {
  EN = 'en',
  ZH_CN = 'zh-CN',
  ZH_TW = 'zh-TW',
}

export interface NavItem {
  key: string;
  path: string;
  icon: any; // Lucide icon component
}

export interface PhotoAlbum {
  id: string;
  titleKey: string;
  descriptionKey: string;
  coverImage: string;
  link: string;
  platform: 'Google Drive' | 'Dropbox' | 'Baidu Pan' | 'OneDrive' | 'Other';
}

export interface GuestbookMessage {
  id: number;
  name: string;
  content: string;
  created_at: string;
}

export interface ContactInfo {
  id?: number;
  name: string;
  role: string;
  email?: string;
  social?: string;
  created_at?: string;
}

export interface Memory {
  id: number;
  title: string;
  content: string; // Markdown
  created_at: string;
  author?: string;
}

export interface TranslationDictionary {
  [key: string]: {
    [Language.EN]: string;
    [Language.ZH_CN]: string;
    [Language.ZH_TW]: string;
  };
}