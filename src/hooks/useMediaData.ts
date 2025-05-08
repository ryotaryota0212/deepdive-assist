import { useState, useEffect } from 'react';
import { MediaItem } from '../types';
import { mediaService } from '../services/media-service';

export const useMediaData = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMediaItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mediaService.getAllMedia();
      setMediaItems(data);
    } catch (err) {
      console.error('Error fetching media items:', err);
      setError('Failed to load media items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaItems();
  }, []);

  return { mediaItems, loading, error, refreshMedia: fetchMediaItems };
};

export const useMediaItem = (id: string) => {
  const [mediaItem, setMediaItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMediaItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mediaService.getMediaById(id);
      setMediaItem(data);
    } catch (err) {
      console.error(`Error fetching media item ${id}:`, err);
      setError('Failed to load media item');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMediaItem();
    }
  }, [id]);

  return { mediaItem, loading, error, refreshMedia: fetchMediaItem };
};
