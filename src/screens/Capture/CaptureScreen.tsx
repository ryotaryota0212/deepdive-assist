import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, RadioButton, Card } from 'react-native-paper';
import { RootStackParamList, MediaType } from '../../types';

type CaptureScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Capture'>;

const CaptureScreen = () => {
  const navigation = useNavigation<CaptureScreenNavigationProp>();
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.MOVIE);
  const [year, setYear] = useState('');

  const handleCapture = () => {
    const newMedia = {
      id: Date.now().toString(),
      title,
      mediaType,
      creator,
      releaseYear: parseInt(year) || undefined,
      capturedAt: new Date(),
    };
    
    console.log('Captured media:', newMedia);
    
    navigation.navigate('MediaDetail', { mediaId: newMedia.id });
  };

  return (
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
        <Button
          mode="contained"
          onPress={handleCapture}
          disabled={!title}
          style={styles.button}
        >
          キャプチャする
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
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
