export enum MediaType {
  MOVIE = 'MOVIE',
  ANIME = 'ANIME',
  BOOK = 'BOOK',
  GAME = 'GAME',
  MUSIC = 'MUSIC',
  OTHER = 'OTHER',
}

export type MediaTypeString = 'movie' | 'anime' | 'book' | 'game' | 'music' | 'other';

export interface MediaItem {
  id: string;
  title: string;
  mediaType: MediaType;
  creator?: string; // Author, director, developer, etc.
  releaseYear?: number;
  coverImage?: string;
  genres?: string[];
  description?: string;
  capturedAt: Date;
}

export interface UserNote {
  id: string;
  mediaId: string;
  content: string;
  rating?: number; // 1-5 star rating
  emotion?: string; // User's emotion when creating the note
  createdAt: Date;
  updatedAt: Date;
}

export interface DeepDiveSession {
  id: string;
  mediaId: string;
  question: string;
  answer: string;
  relatedWorks?: MediaItem[];
  createdAt: Date;
}

export type RootStackParamList = {
  Home: undefined;
  Capture: undefined;
  Notes: { mediaId?: string };
  DeepDive: { mediaId: string };
  MediaDetail: { mediaId: string };
};
