import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, RadioButton, Card, Snackbar } from 'react-native-paper';
import { RootStackParamList, MediaType } from '../../types';
import { mediaService } from '../../services/media-service';

type CaptureScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Capture'>;

const CaptureScreen = () => {
  const navigation = useNavigation<CaptureScreenNavigationProp>();
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.MOVIE);
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const handleCapture = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('リクエストがタイムアウトしました。サーバーが実行されていることを確認してください。')), 10000)
      );
      
      const newMedia = {
        title,
        mediaType,
        creator,
        releaseYear: parseInt(year) || new Date().getFullYear(),
        description: '',
        genres: [],
      };
      
      const createdMedia = await Promise.race([
        mediaService.createMedia(newMedia),
        timeoutPromise
      ]) as any;
      
      console.log('Captured media:', createdMedia);
      
      setTitle('');
      setCreator('');
      setYear('');
      
      navigation.navigate('MediaDetail', { mediaId: createdMedia.id });
    } catch (err) {
      console.error('Error capturing media:', err);
      setError('作品の保存中にエラーが発生しました。バックエンドサーバーが実行されていることを確認してください。');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Title title="作品をキャプチャ" />
          <Card.Content>
            <Text style={styles.label}>タイトル</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="作品のタイトルを入力"
            />

            <Text style={styles.label}>作者/クリエイター</Text>
            <TextInput
              style={styles.input}
              value={creator}
              onChangeText={setCreator}
              placeholder="作者、監督、開発者など"
            />

            <Text style={styles.label}>リリース年</Text>
            <TextInput
              style={styles.input}
              value={year}
              onChangeText={setYear}
              placeholder="例: 2023"
              keyboardType="numeric"
            />

            <Text style={styles.label}>メディアタイプ</Text>
            <RadioButton.Group
              onValueChange={(value: string) => setMediaType(value as MediaType)}
              value={mediaType}
            >
              <View style={styles.radioRow}>
                <RadioButton.Item label="映画" value={MediaType.MOVIE} />
                <RadioButton.Item label="アニメ" value={MediaType.ANIME} />
              </View>
              <View style={styles.radioRow}>
                <RadioButton.Item label="書籍" value={MediaType.BOOK} />
                <RadioButton.Item label="ゲーム" value={MediaType.GAME} />
              </View>
              <View style={styles.radioRow}>
                <RadioButton.Item label="音楽" value={MediaType.MUSIC} />
                <RadioButton.Item label="その他" value={MediaType.OTHER} />
              </View>
            </RadioButton.Group>
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          {loading ? (
            <View style={[styles.button, { justifyContent: 'center', alignItems: 'center' }]}>
              <ActivityIndicator size="small" color="#6200ee" />
            </View>
          ) : (
            <Button
              mode="contained"
              onPress={handleCapture}
              disabled={!title}
              style={styles.button}
            >
              キャプチャする
            </Button>
          )}
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
            disabled={loading}
          >
            キャンセル
          </Button>
        </View>

        <Card style={styles.card}>
          <Card.Title title="または外部サービスから取り込む" />
          <Card.Content>
            <Button
              mode="outlined"
              icon="barcode-scan"
              onPress={() => console.log('Barcode scan')}
              style={styles.serviceButton}
            >
              バーコードをスキャン
            </Button>
            <Button
              mode="outlined"
              icon="movie"
              onPress={() => console.log('TMDb import')}
              style={styles.serviceButton}
            >
              TMDb から取り込む
            </Button>
            <Button
              mode="outlined"
              icon="book"
              onPress={() => console.log('Kindle import')}
              style={styles.serviceButton}
            >
              Kindle から取り込む
            </Button>
          </Card.Content>
        </Card>
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
  card: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  serviceButton: {
    marginVertical: 8,
  },
});

export default CaptureScreen;
