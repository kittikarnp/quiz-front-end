import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

export default function HistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [grouped, setGrouped] = useState<any[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailItems, setDetailItems] = useState<any[]>([]);
  const navigation = useNavigation();
  const theme = useColorScheme();
  const isDark = theme === 'dark';
   
 
  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);
 

  useEffect(() => {
    const load = async () => {
      const raw = await AsyncStorage.getItem('scoreHistory');
      if (!raw) return;

      const data = JSON.parse(raw);

      const playerMap: {
        [player: string]: { correct: number; total: number; time: number; items: any[] };
      } = {};

      for (const item of data) {
        const { player, correct, timeSpent } = item;
        if (!playerMap[player]) {
          playerMap[player] = { correct: 0, total: 0, time: 0, items: [] };
        }
        playerMap[player].correct += correct ? 1 : 0;
        playerMap[player].total += 1;
        playerMap[player].time += timeSpent ?? 0;
        playerMap[player].items.push(item);
      }

      const result = Object.keys(playerMap)
        .map((name) => ({
          player: name,
          score: playerMap[name].correct,
          total: playerMap[name].total,
          time: playerMap[name].time,
          items: playerMap[name].items,
        }))
        .sort((a, b) => b.score - a.score);

      setHistory(data.reverse());
      setGrouped(result);
    };

    load();
  }, []);

  const showDetail = (player: string, items: any[]) => {
    setSelectedPlayer(player);
    setDetailItems(items);
    setDetailVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkBackground]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Text style={[styles.header, isDark && styles.darkText]}>🏆 Player Rankings</Text>

      <FlatList
        data={grouped}
        keyExtractor={(item) => item.player}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => showDetail(item.player, item.items)} style={styles.rankCard}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.player}>{item.player}</Text>
              <Text style={styles.detail}>Score: {item.score}/{item.total}  |  Time: {item.time}s</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity onPress={() => (navigation as any).navigate('index')} style={styles.homeButton}>
        <Text style={styles.homeButtonText}>🏠 Back to Home</Text>
      </TouchableOpacity>

      <Modal visible={detailVisible} animationType="slide" onRequestClose={() => setDetailVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <Text style={styles.modalHeader}>📋 Details for: {selectedPlayer}</Text>
          <ScrollView>
            {detailItems.map((item, i) => (
              <View key={i} style={styles.detailCard}>
                <Text style={styles.qtext}>Q{i + 1}: {item.question}</Text>
                <Text style={styles.subtext}>Result: {item.correct ? '✅ Correct' : '❌ Wrong'}</Text>
                <Text style={styles.subtext}>Time: {item.timeSpent}s</Text>
                <Text style={styles.subtext}>Date: {new Date(item.date).toLocaleString()}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity onPress={() => setDetailVisible(false)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  darkBackground: {
    backgroundColor: '#FFDDE1',
  },
  darkText: {
    color: '#121212',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  rankCard: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderColor: '#90CAF9',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 40,
    color: '#1976D2',
  },
  player: {
    fontSize: 17,
    fontWeight: '600',
  },
  detail: {
    fontSize: 14,
    color: '#555',
  },
  homeButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFDDE1',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#121212',
  },
  detailCard: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#81C784',
    borderWidth: 1,
  },
  qtext: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 14,
    marginBottom: 2,
  },
  closeButton: {
    backgroundColor: '#388E3C',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});
