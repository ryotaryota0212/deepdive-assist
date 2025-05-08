import { apiClient } from './api-client';
import { UserNote } from '../types';

/**
 * Service for interacting with notes API endpoints
 */
class NotesService {
  async getNotesByMediaId(mediaId: string): Promise<UserNote[]> {
    const response = await apiClient.get<any[]>(`/notes?media_id=${mediaId}`);
    return response.map(this.transformNoteResponse);
  }

  async getNoteById(id: string): Promise<UserNote> {
    const response = await apiClient.get<any>(`/notes/${id}`);
    return this.transformNoteResponse(response);
  }

  async createNote(note: Partial<UserNote>): Promise<UserNote> {
    const requestData = {
      media_id: parseInt(note.mediaId as string),
      content: note.content,
      rating: note.rating,
      emotion: note.emotion,
    };

    const response = await apiClient.post<any>('/notes', requestData);
    return this.transformNoteResponse(response);
  }

  async updateNote(id: string, note: Partial<UserNote>): Promise<UserNote> {
    const requestData = {
      content: note.content,
      rating: note.rating,
      emotion: note.emotion,
    };

    const response = await apiClient.put<any>(`/notes/${id}`, requestData);
    return this.transformNoteResponse(response);
  }

  async deleteNote(id: string): Promise<void> {
    await apiClient.delete(`/notes/${id}`);
  }

  /**
   * Transform backend note response to frontend UserNote
   */
  private transformNoteResponse(data: any): UserNote {
    return {
      id: data.id.toString(),
      mediaId: data.media_id.toString(),
      content: data.content,
      rating: data.rating,
      emotion: data.emotion,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}

export const notesService = new NotesService();
