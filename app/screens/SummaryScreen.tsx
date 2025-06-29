import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { createSession, getSummary } from '../services/api';
 
export const unstable_screenOptions = {
  headerShown: false,
  tabBarStyle: { display: 'none' },
};

export default function SummaryScreen() {
  const { sessionId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [resultText, setResultText] = useState('');

useLayoutEffect(() => {
  navigation.setOptions({
    headerShown: false,
  });

  const parent = navigation.getParent();
  parent?.setOptions({
    tabBarStyle: { display: 'none' },
  });

  return () => {
    parent?.setOptions({ tabBarStyle: undefined });
  };
}, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSummary(sessionId as string);
        if (!res || res.score == null) {
          setScore(0);
          setResultText('Fail');
        } else {
          setScore(res.score);
          const result =
            res.score >= 8 ? 'Excellent' : res.score >= 5 ? 'Pass' : 'Fail';
          setResultText(result);
        }

        await AsyncStorage.removeItem('sessionId');
        await AsyncStorage.removeItem(`currentIndex_${sessionId}`);
      } catch (e) {
        console.error('Error loading summary:', e);
        setScore(0);
        setResultText('Fail');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleReplayGame = async () => {
    try {
      const newSessionId = await createSession();
      await AsyncStorage.setItem('sessionId', newSessionId);

      // ✅ กลับไปหน้า index.tsx ที่อยู่ในโฟล์เดอร์ (tabs)
     router.replace('/(tabs)');
    } catch (e) {
      console.error('❌ Replay Error:', e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFDDE1" />
      <Text style={styles.topLeftTitle}>QUIZ ISLAND</Text>
      <Text style={styles.subHeader}>QUIZ ENDING</Text>

      <Text style={styles.scoreLabel}>Score Is</Text>
      <Text style={styles.score}>{score} / 10</Text>
      <Text style={styles.result}>Result : {resultText}</Text>

      <TouchableOpacity style={styles.button} onPress={handleReplayGame}>
        <Text style={styles.buttonText}>CONTINUE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDDE1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subHeader: {
    position: 'absolute',
    top: 90,
    left: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  topLeftTitle: {
    position: 'absolute',
    top: 20,
    left: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  scoreLabel: {
    fontSize: 16,
    marginTop: 32,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  result: {
    fontSize: 18,
    marginVertical: 12,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16,
  },
});
