import { useState, useEffect } from 'react';
import { UserNote } from '../types';
import { notesService } from '../services/notes-service';

export const useNotes = (mediaId?: string) => {
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    if (!mediaId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await notesService.getNotesByMediaId(mediaId);
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mediaId) {
      fetchNotes();
    }
  }, [mediaId]);

  const createNote = async (note: Partial<UserNote>) => {
    try {
      const newNote = await notesService.createNote(note);
      setNotes((prev) => [...prev, newNote]);
      return newNote;
    } catch (err) {
      console.error('Error creating note:', err);
      throw err;
    }
  };

  return { notes, loading, error, refreshNotes: fetchNotes, createNote };
};
