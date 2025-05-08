import { useState, useEffect } from 'react';
import { DeepDiveSession } from '../types';
import { deepDiveService } from '../services/deep-dive-service';

export const useDeepDiveSessions = (mediaId?: string) => {
  const [sessions, setSessions] = useState<DeepDiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    if (!mediaId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await deepDiveService.getSessionsByMediaId(mediaId);
      setSessions(data);
    } catch (err) {
      console.error('Error fetching deep dive sessions:', err);
      setError('Failed to load deep dive sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mediaId) {
      fetchSessions();
    }
  }, [mediaId]);

  const createSession = async (question: string) => {
    if (!mediaId) return null;
    
    try {
      const newSession = await deepDiveService.createSession(mediaId, question);
      setSessions((prev) => [...prev, newSession]);
      return newSession;
    } catch (err) {
      console.error('Error creating deep dive session:', err);
      throw err;
    }
  };

  return { sessions, loading, error, refreshSessions: fetchSessions, createSession };
};
