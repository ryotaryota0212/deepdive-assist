import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Button, Card, Chip, Divider, Snackbar } from 'react-native-paper';
import { RootStackParamList, MediaItem } from '../../types';
import { useMediaItem } from '../../hooks/useMediaData';
import { useDeepDiveSessions } from '../../hooks/useDeepDiveData';

type DeepDiveScreenRouteProp = RouteProp<RootStackParamList, 'DeepDive'>;


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
  const navigation = useNavigation();
  const { mediaId } = route.params;
  
  const { mediaItem, loading: mediaLoading, error: mediaError, refreshMedia } = useMediaItem(mediaId || '');
  const { sessions, loading: sessionsLoading, error: sessionsError, createSession, refreshSessions } = useDeepDiveSessions(mediaId);
  
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshMedia(), refreshSessions()]);
    setRefreshing(false);
  };

  const handleAskQuestion = async (q: string = question) => {
    if (!q || !mediaId) return;
    
    try {
      setQuestion(q);
      setIsLoading(true);
      setError(null);
      
      const newSession = await createSession(q);
      console.log('Created deep dive session:', newSession);
      
      setQuestion('');
    } catch (err) {
      console.error('Error creating deep dive session:', err);
      setError('質問の処理中にエラーが発生しました。もう一度お試しください。');
      setSnackbarVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
            <Card.Title title="作品が見つかりません" />
            <Card.Content>
              <Text>指定された作品が見つかりませんでした。</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.goBack()}>戻る</Button>
            </Card.Actions>
          </Card>
        )}

      <Card style={styles.questionCard}>
        <Card.Title title="質問する" />
        <Card.Content>
          <TextInput
            style={styles.questionInput}
            value={question}
            onChangeText={setQuestion}
            placeholder="作品について質問してください..."
            editable={!isLoading}
          />
          
          <Text style={styles.presetTitle}>プリセット質問</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsContainer}>
            {presetQuestions.map((q, index) => (
              <Chip
                key={index}
                onPress={() => handleAskQuestion(q)}
                style={styles.presetChip}
                disabled={isLoading}
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
            disabled={!question || isLoading || !mediaId}
          >
            質問する
          </Button>
        </Card.Actions>
      </Card>

      {sessionsLoading && !refreshing ? (
        <Card style={styles.answerCard}>
          <Card.Content style={{ alignItems: 'center', padding: 20 }}>
            <ActivityIndicator size="small" color="#6200ee" />
            <Text style={{ marginTop: 10 }}>セッションを読み込み中...</Text>
          </Card.Content>
        </Card>
      ) : sessionsError ? (
        <Card style={styles.answerCard}>
          <Card.Title title="エラーが発生しました" />
          <Card.Content>
            <Text>セッションの取得中にエラーが発生しました。</Text>
          </Card.Content>
          <Card.Actions>
            <Button onPress={refreshSessions}>再試行</Button>
          </Card.Actions>
        </Card>
      ) : sessions && sessions.length > 0 ? (
        sessions.map((session) => (
          <Card key={session.id} style={styles.answerCard}>
            <Card.Title title={`質問: ${session.question}`} />
            <Card.Content>
              <Text style={styles.answerText}>{session.answer}</Text>
              
              {session.relatedWorks && session.relatedWorks.length > 0 && (
                <>
                  <Divider style={styles.divider} />
                  <Text style={styles.relatedTitle}>関連作品</Text>
                  {session.relatedWorks.map((work) => (
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
        ))
      ) : null}
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
