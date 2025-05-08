import { apiClient } from './api-client';
import { MediaItem, MediaType } from '../types';

/**
 * Service for interacting with media API endpoints
 */
class MediaService {
  async getAllMedia(): Promise<MediaItem[]> {
    const response = await apiClient.get<any[]>('/media');
    return response.map(this.transformMediaResponse);
  }

  async getMediaById(id: string): Promise<MediaItem> {
    const response = await apiClient.get<any>(`/media/${id}`);
    return this.transformMediaResponse(response);
  }

  async createMedia(media: Partial<MediaItem>): Promise<MediaItem> {
    const requestData = {
      title: media.title,
      media_type: media.mediaType,
      creator: media.creator,
      release_year: media.releaseYear,
      cover_image: media.coverImage,
      description: media.description,
      genres: media.genres,
    };

    const response = await apiClient.post<any>('/media', requestData);
    return this.transformMediaResponse(response);
  }

  async updateMedia(id: string, media: Partial<MediaItem>): Promise<MediaItem> {
    const requestData = {
      title: media.title,
      media_type: media.mediaType,
      creator: media.creator,
      release_year: media.releaseYear,
      cover_image: media.coverImage,
      description: media.description,
      genres: media.genres,
    };

    const response = await apiClient.put<any>(`/media/${id}`, requestData);
    return this.transformMediaResponse(response);
  }

  async deleteMedia(id: string): Promise<void> {
    await apiClient.delete(`/media/${id}`);
  }

  /**
   * Transform backend media response to frontend MediaItem
   */
  private transformMediaResponse(data: any): MediaItem {
    return {
      id: data.id.toString(),
      title: data.title,
      mediaType: data.media_type as MediaType,
      creator: data.creator,
      releaseYear: data.release_year,
      coverImage: data.cover_image,
      description: data.description,
      genres: data.genres || [],
      capturedAt: new Date(data.captured_at),
    };
  }
}

export const mediaService = new MediaService();
