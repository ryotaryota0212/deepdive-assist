import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Chip, Divider } from 'react-native-paper';
import { RootStackParamList, MediaItem, MediaType } from '../types';
import { useMediaItem } from '../hooks/useMediaData';

type MediaDetailRouteProp = RouteProp<RootStackParamList, 'MediaDetail'>;
type MediaDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MediaDetail'>;


const MediaDetailScreen = () => {
  const route = useRoute<MediaDetailRouteProp>();
  const navigation = useNavigation<MediaDetailNavigationProp>();
  const { mediaId } = route.params;
  const { mediaItem, loading, error, refreshMedia } = useMediaItem(mediaId);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={{ textAlign: 'center', marginTop: 16 }}>読み込み中...</Text>
      </View>
    );
  }

  if (error || !mediaItem) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginBottom: 16 }}>
          エラーが発生しました。再度お試しください。
        </Text>
        <Button onPress={refreshMedia} mode="contained">
          更新
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: mediaItem.coverImage || 'https://via.placeholder.com/150' }}
          style={styles.coverImage}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.title}>{mediaItem.title}</Text>
          <Text style={styles.creator}>{mediaItem.creator} • {mediaItem.releaseYear}</Text>
          <View style={styles.genreContainer}>
            {mediaItem.genres?.map((genre, index) => (
              <Chip key={index} style={styles.genreChip}>{genre}</Chip>
            ))}
          </View>
        </View>
      </View>

      <Divider style={styles.divider} />

      <Text style={styles.sectionTitle}>あらすじ</Text>
      <Text style={styles.description}>{mediaItem.description}</Text>

      <Divider style={styles.divider} />

      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon="note-edit"
          onPress={() => navigation.navigate('Notes', { mediaId: mediaItem.id })}
          style={styles.actionButton}
        >
          メモを追加
        </Button>
        <Button
          mode="contained"
          icon="brain"
          onPress={() => navigation.navigate('DeepDive', { mediaId: mediaItem.id })}
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
