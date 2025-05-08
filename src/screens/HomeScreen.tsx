import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Card } from 'react-native-paper';
import { RootStackParamList, MediaItem, MediaType } from '../types';
import { useMediaData } from '../hooks/useMediaData';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;


const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { mediaItems, loading, error, refreshMedia } = useMediaData();

  const renderMediaItem = ({ item }: { item: MediaItem }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('MediaDetail', { mediaId: item.id })}
    >
      <Card style={styles.card}>
        <Card.Cover source={{ uri: item.coverImage || 'https://via.placeholder.com/150' }} />
        <Card.Content>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.mediaType} • {item.releaseYear}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>深掘りアシスト</Text>
        <Text style={styles.headerSubtitle}>作品を記録して深く理解しよう</Text>
      </View>

      <View style={styles.flowButtons}>
        <Button
          mode="contained"
          icon="camera"
          onPress={() => navigation.navigate('Capture')}
          style={styles.flowButton}
        >
          キャプチャ
        </Button>
        <Button
          mode="contained"
          icon="note"
          onPress={() => navigation.navigate('Notes', {})}
          style={styles.flowButton}
        >
          メモ
        </Button>
        <Button
          mode="contained"
          icon="brain"
          onPress={() => mediaItems.length > 0 ? navigation.navigate('DeepDive', { mediaId: mediaItems[0].id }) : null}
          style={styles.flowButton}
          disabled={mediaItems.length === 0}
        >
          深掘り
        </Button>
      </View>

      <Text style={styles.sectionTitle}>最近のキャプチャ</Text>
      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.emptyStateText}>読み込み中...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            エラーが発生しました。下に引っ張って更新してください。
          </Text>
          <Button onPress={refreshMedia} mode="contained" style={{ marginTop: 12 }}>
            更新
          </Button>
        </View>
      ) : mediaItems.length > 0 ? (
        <FlatList
          data={mediaItems}
          renderItem={renderMediaItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mediaList}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshMedia} />
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            まだ作品がキャプチャされていません。「キャプチャ」ボタンから作品を追加しましょう。
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  flowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  flowButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mediaList: {
    paddingRight: 16,
  },
  card: {
    width: 160,
    marginRight: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
  },
});

export default HomeScreen;
