import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card, Chip, Snackbar } from 'react-native-paper';
import Rating from '../../components/Rating';
import { RootStackParamList, MediaItem, UserNote, MediaType } from '../../types';
import { useNotes } from '../../hooks/useNotesData';
import { useMediaItem } from '../../hooks/useMediaData';

type NotesScreenRouteProp = RouteProp<RootStackParamList, 'Notes'>;
type NotesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Notes'>;


const emotions = [
  { label: '感動', value: 'moved' },
  { label: '興奮', value: 'excited' },
  { label: '驚き', value: 'surprised' },
  { label: '笑い', value: 'amused' },
  { label: '悲しみ', value: 'sad' },
  { label: '怒り', value: 'angry' },
  { label: '恐怖', value: 'scared' },
  { label: '混乱', value: 'confused' },
];

const NotesScreen = () => {
  const route = useRoute<NotesScreenRouteProp>();
  const navigation = useNavigation<NotesScreenNavigationProp>();
  const { mediaId } = route.params || {};
  
  const { mediaItem, loading: mediaLoading, error: mediaError } = useMediaItem(mediaId || '');
  const { notes, loading: notesLoading, error: notesError, createNote, refreshNotes } = useNotes(mediaId);
  
  const [noteContent, setNoteContent] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleSaveNote = async () => {
    if (!noteContent || !mediaId) return;
    
    try {
      setSaving(true);
      setError(null);
      
      const newNote: Partial<UserNote> = {
        mediaId: mediaId,
        content: noteContent,
        rating: rating || undefined,
        emotion: selectedEmotion || undefined,
      };
      
      const savedNote = await createNote(newNote);
      console.log('Saved note:', savedNote);
      
      setNoteContent('');
      setRating(0);
      setSelectedEmotion(null);
      
      setTimeout(() => {
        setAiSummary('このメモからは、作品の世界観に深く没入し、キャラクターの成長に共感している様子が伺えます。特に主人公の内面的な葛藤と決断のプロセスに注目しているようです。');
      }, 1000);
    } catch (err) {
      console.error('Error saving note:', err);
      setError('メモの保存中にエラーが発生しました。もう一度お試しください。');
      setSnackbarVisible(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {mediaLoading ? (
          <Card style={styles.mediaCard}>
            <Card.Content style={{ alignItems: 'center', padding: 20 }}>
              <ActivityIndicator size="large" color="#6200ee" />
              <Text style={{ marginTop: 10 }}>作品情報を読み込み中...</Text>
            </Card.Content>
          </Card>
        ) : mediaError ? (
          <Card style={styles.mediaCard}>
            <Card.Title title="エラーが発生しました" />
            <Card.Content>
              <Text>作品情報の取得中にエラーが発生しました。</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.goBack()}>戻る</Button>
            </Card.Actions>
          </Card>
        ) : mediaItem ? (
          <Card style={styles.mediaCard}>
            <Card.Title 
              title={mediaItem.title} 
              subtitle={`${mediaItem.creator} • ${mediaItem.releaseYear}`} 
            />
          </Card>
        ) : (
          <Card style={styles.mediaCard}>
            <Card.Title title="新しいメモ" subtitle="作品を選択していません" />
            <Card.Actions>
              <Button onPress={() => navigation.navigate('Capture')}>作品を選択</Button>
            </Card.Actions>
          </Card>
        )}

      <Card style={styles.noteCard}>
        <Card.Title title="メモ & 感情ログ" />
        <Card.Content>
          <Text style={styles.label}>メモ</Text>
          <TextInput
            style={styles.noteInput}
            value={noteContent}
            onChangeText={setNoteContent}
            placeholder="作品についての感想や気づきを記録しましょう..."
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>評価</Text>
          <Rating
            value={rating}
            onValueChange={setRating}
            size={30}
            style={styles.rating}
          />

          <Text style={styles.label}>感情</Text>
          <View style={styles.emotionsContainer}>
            {emotions.map((emotion) => (
              <Chip
                key={emotion.value}
                selected={selectedEmotion === emotion.value}
                onPress={() => setSelectedEmotion(emotion.value)}
                style={styles.emotionChip}
              >
                {emotion.label}
              </Chip>
            ))}
          </View>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={handleSaveNote}
            disabled={!noteContent}
          >
            保存
          </Button>
        </Card.Actions>
      </Card>

      {aiSummary && (
        <Card style={styles.aiCard}>
          <Card.Title title="AI要約" />
          <Card.Content>
            <Text>{aiSummary}</Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('DeepDive', { mediaId: mediaId || '' })}
              disabled={!mediaId}
            >
              深掘りする
            </Button>
          </Card.Actions>
        </Card>
      )}
      </ScrollView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: '閉じる',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  mediaCard: {
    marginBottom: 16,
  },
  noteCard: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  noteInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    height: 120,
    textAlignVertical: 'top',
  },
  rating: {
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  emotionChip: {
    margin: 4,
  },
  aiCard: {
    marginBottom: 16,
    backgroundColor: '#f0f8ff',
  },
});

export default NotesScreen;
