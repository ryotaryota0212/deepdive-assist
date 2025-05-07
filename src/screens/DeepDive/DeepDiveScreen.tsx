import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Button, Card, Chip, Divider } from 'react-native-paper';
import { RootStackParamList, MediaItem, DeepDiveSession, MediaType } from '../../types';

type DeepDiveScreenRouteProp = RouteProp<RootStackParamList, 'DeepDive'>;

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

const presetQuestions = [
  '作品の裏テーマを解説して',
  '作者の他作品と比較して特徴を教えて',
  'この作品が社会に与えた影響は？',
  '似たテーマの名作を年代順に教えて',
  'なぜ私はこの作品に共感したのか？',
  'この作品の批評的評価について教えて',
];

const DeepDiveScreen = () => {
  const route = useRoute<DeepDiveScreenRouteProp>();
  const { mediaId } = route.params;
  
  const [media, setMedia] = useState<MediaItem | null>(null);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [relatedWorks, setRelatedWorks] = useState<MediaItem[]>([]);

  useEffect(() => {
    setMedia(mockMediaItems[mediaId]);
  }, [mediaId]);

  const handleAskQuestion = (q: string = question) => {
    if (!q) return;
    
    setQuestion(q);
    setIsLoading(true);
    setAnswer(null);
    
    setTimeout(() => {
      setIsLoading(false);
      
      if (media?.title === '鬼滅の刃') {
        setAnswer(`「鬼滅の刃」の裏テーマは「家族の絆と人間性の回復」です。

表面的には鬼との戦いを描いたアクション作品ですが、根底にあるのは「人間らしさとは何か」という問いかけです。

主人公・炭治郎は家族を失いながらも、鬼と化した妹・禰豆子の人間性を信じ続けます。この「人間と鬼」の二項対立は単純な善悪ではなく、人間が持つ残酷さと鬼が持つ哀しみという複雑な感情を描いています。

作中の鬼たちは皆、人間だった頃の記憶や感情の欠片を持っており、彼らの過去の物語は「人間社会の闇」を象徴しています。

また、呼吸法という超人的な力を得るために「全集中」する修行は、現代社会で失われつつある「一つのことに打ち込む集中力と忍耐」の大切さを示唆しています。`);
        
        setRelatedWorks([
          {
            id: '101',
            title: '進撃の巨人',
            mediaType: MediaType.ANIME,
            creator: '諫山創',
            releaseYear: 2013,
            capturedAt: new Date(),
          },
          {
            id: '102',
            title: 'NARUTO -ナルト-',
            mediaType: MediaType.ANIME,
            creator: '岸本斉史',
            releaseYear: 2002,
            capturedAt: new Date(),
          },
        ]);
      } else {
        setAnswer('この作品についての深い分析結果がここに表示されます。作品のテーマ、象徴、社会的影響などについて考察します。');
      }
    }, 2000);
  };

  if (!media) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.mediaCard}>
        <Card.Title title={media.title} subtitle={`${media.creator} • ${media.releaseYear}`} />
      </Card>

      <Card style={styles.questionCard}>
        <Card.Title title="質問する" />
        <Card.Content>
          <TextInput
            style={styles.questionInput}
            value={question}
            onChangeText={setQuestion}
            placeholder="作品について質問してください..."
          />
          
          <Text style={styles.presetTitle}>プリセット質問</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsContainer}>
            {presetQuestions.map((q, index) => (
              <Chip
                key={index}
                onPress={() => handleAskQuestion(q)}
                style={styles.presetChip}
              >
                {q}
              </Chip>
            ))}
          </ScrollView>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => handleAskQuestion()}
            loading={isLoading}
            disabled={!question || isLoading}
          >
            質問する
          </Button>
        </Card.Actions>
      </Card>

      {answer && (
        <Card style={styles.answerCard}>
          <Card.Title title="AI分析" />
          <Card.Content>
            <Text style={styles.answerText}>{answer}</Text>
            
            {relatedWorks.length > 0 && (
              <>
                <Divider style={styles.divider} />
                <Text style={styles.relatedTitle}>関連作品</Text>
                {relatedWorks.map((work) => (
                  <Card key={work.id} style={styles.relatedCard}>
                    <Card.Title
                      title={work.title}
                      subtitle={`${work.creator} • ${work.releaseYear}`}
                    />
                  </Card>
                ))}
              </>
            )}
          </Card.Content>
          <Card.Actions>
            <Button
              mode="outlined"
              icon="share"
              onPress={() => console.log('Share deep dive')}
            >
              シェア
            </Button>
            <Button
              mode="outlined"
              icon="content-save"
              onPress={() => console.log('Save deep dive')}
            >
              保存
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
  questionCard: {
    marginBottom: 16,
  },
  questionInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  presetsContainer: {
    marginBottom: 16,
  },
  presetChip: {
    marginRight: 8,
  },
  answerCard: {
    marginBottom: 16,
  },
  answerText: {
    fontSize: 16,
    lineHeight: 24,
  },
  divider: {
    marginVertical: 16,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  relatedCard: {
    marginBottom: 8,
  },
});

export default DeepDiveScreen;
