import { apiClient } from './api-client';
import { DeepDiveSession, MediaItem } from '../types';

/**
 * Service for interacting with deep dive API endpoints
 */
class DeepDiveService {
  async getSessionsByMediaId(mediaId: string): Promise<DeepDiveSession[]> {
    const response = await apiClient.get<any[]>(`/deep-dive?media_id=${mediaId}`);
    return response.map(this.transformSessionResponse);
  }

  async getSessionById(id: string): Promise<DeepDiveSession> {
    const response = await apiClient.get<any>(`/deep-dive/${id}`);
    return this.transformSessionResponse(response);
  }

  async createSession(mediaId: string, question: string): Promise<DeepDiveSession> {
    const requestData = {
      media_id: parseInt(mediaId),
      question: question,
    };

    const response = await apiClient.post<any>('/deep-dive', requestData);
    return this.transformSessionResponse(response);
  }

  async deleteSession(id: string): Promise<void> {
    await apiClient.delete(`/deep-dive/${id}`);
  }

  /**
   * Transform backend session response to frontend DeepDiveSession
   */
  private transformSessionResponse(data: any): DeepDiveSession {
    return {
      id: data.id.toString(),
      mediaId: data.media_id.toString(),
      question: data.question,
      answer: data.answer,
      relatedWorks: data.related_works ? data.related_works.map(this.transformRelatedWork) : [],
      createdAt: new Date(data.created_at),
    };
  }

  /**
   * Transform backend related work to frontend MediaItem
   */
  private transformRelatedWork(data: any): Partial<MediaItem> {
    return {
      id: data.id?.toString(),
      title: data.title,
      creator: data.creator,
      description: data.description,
    };
  }
}

export const deepDiveService = new DeepDiveService();
