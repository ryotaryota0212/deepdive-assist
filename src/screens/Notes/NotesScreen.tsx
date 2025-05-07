import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card, Chip } from 'react-native-paper';
import Rating from '../../components/Rating';
import { RootStackParamList, MediaItem, UserNote, MediaType } from '../../types';

type NotesScreenRouteProp = RouteProp<RootStackParamList, 'Notes'>;
type NotesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Notes'>;

const mockMediaItems: Record<string, MediaItem> = {
  '1': {
    id: '1',
    title: '鬼滅の刃',
    mediaType: MediaType.ANIME, // Using proper enum value
    creator: '吾峠呼世晴',
    releaseYear: 2019,
    coverImage: 'https://via.placeholder.com/150',
    genres: ['アクション', 'ファンタジー'],
    description: '家族を鬼に殺された少年が、鬼殺隊に入隊し、妹を人間に戻すために戦う物語。',
    capturedAt: new Date(),
  },
  '2': {
    id: '2',
    title: 'ハリー・ポッターと賢者の石',
    mediaType: MediaType.BOOK, // Using proper enum value
    creator: 'J.K. ローリング',
    releaseYear: 1997,
    coverImage: 'https://via.placeholder.com/150',
    genres: ['ファンタジー', '冒険'],
    description: '11歳の少年ハリー・ポッターが魔法学校ホグワーツで魔法を学び、闇の魔法使いヴォルデモートと対決する物語。',
    capturedAt: new Date(),
  },
};

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
  
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  useEffect(() => {
    if (mediaId) {
      setMedia(mockMediaItems[mediaId]);
    }
  }, [mediaId]);

  const handleSaveNote = () => {
    if (!noteContent) return;

    const newNote: UserNote = {
      id: Date.now().toString(),
      mediaId: media?.id || '',
      content: noteContent,
      rating: rating || undefined,
      emotion: selectedEmotion || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    console.log('Saved note:', newNote);
    
    setTimeout(() => {
      setAiSummary('このメモからは、作品の世界観に深く没入し、キャラクターの成長に共感している様子が伺えます。特に主人公の内面的な葛藤と決断のプロセスに注目しているようです。');
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      {media ? (
        <Card style={styles.mediaCard}>
          <Card.Title title={media.title} subtitle={`${media.creator} • ${media.releaseYear}`} />
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
              onPress={() => navigation.navigate('DeepDive', { mediaId: media?.id || '' })}
              disabled={!media}
            >
              深掘りする
            </Button>
          </Card.Actions>
        </Card>
      )}
    </ScrollView>
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
