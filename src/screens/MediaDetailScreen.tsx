import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Chip, Divider } from 'react-native-paper';
import { RootStackParamList, MediaItem, MediaType } from '../types';

type MediaDetailRouteProp = RouteProp<RootStackParamList, 'MediaDetail'>;
type MediaDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MediaDetail'>;

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

const MediaDetailScreen = () => {
  const route = useRoute<MediaDetailRouteProp>();
  const navigation = useNavigation<MediaDetailNavigationProp>();
  const { mediaId } = route.params;
  const [media, setMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    setMedia(mockMediaItems[mediaId]);
  }, [mediaId]);

  if (!media) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: media.coverImage || 'https://via.placeholder.com/150' }}
          style={styles.coverImage}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{media.title}</Text>
          <Text style={styles.creator}>{media.creator} • {media.releaseYear}</Text>
          <View style={styles.genreContainer}>
            {media.genres?.map((genre, index) => (
              <Chip key={index} style={styles.genreChip}>{genre}</Chip>
            ))}
          </View>
        </View>
      </View>

      <Divider style={styles.divider} />

      <Text style={styles.sectionTitle}>あらすじ</Text>
      <Text style={styles.description}>{media.description}</Text>

      <Divider style={styles.divider} />

      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon="note-edit"
          onPress={() => navigation.navigate('Notes', { mediaId: media.id })}
          style={styles.actionButton}
        >
          メモを追加
        </Button>
        <Button
          mode="contained"
          icon="brain"
          onPress={() => navigation.navigate('DeepDive', { mediaId: media.id })}
          style={styles.actionButton}
        >
          深掘りする
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  creator: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  genreChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginHorizontal: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default MediaDetailScreen;
