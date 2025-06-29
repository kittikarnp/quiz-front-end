import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { createSession } from '../services/api';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [playerName, setPlayerName] = useState('');
  const [existingSession, setExistingSession] = useState<string | null>(null);
 
  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);

  useEffect(() => {
    AsyncStorage.getItem('sessionId').then(setExistingSession);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setPlayerName('');
    }, [])
  );

  const startGame = async () => {
    if (playerName.trim() === '') {
      Alert.alert('กรุณากรอกชื่อผู้เล่น');
      return;
    }

    try {
      await AsyncStorage.removeItem('sessionId');
      const allKeys = await AsyncStorage.getAllKeys();
      const indexKeys = allKeys.filter((key) => key.startsWith('currentIndex_'));
      await AsyncStorage.multiRemove(indexKeys);

      const sessionId = await createSession();
      await AsyncStorage.setItem('sessionId', sessionId);
      await AsyncStorage.setItem('playerName', playerName);

      (navigation as any).navigate('QuestionScreen', { sessionId });
    } catch (error) {
      console.error('❌ สร้าง Session ไม่สำเร็จ:', error);
      Alert.alert('เกิดข้อผิดพลาดในการเริ่มเกม');
    }
  };

  const goToHistory = () => {
    (navigation as any).navigate('HistoryScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.topLeftTitle}>QUIZ ISLAND</Text>
      <Image source={require('../../assets/images/QUIZ.png')} style={styles.logo} />
      <Text style={styles.title}>🌴 Welcome 🏝️</Text>

      <TextInput
        placeholder="Enter your name"
        value={playerName}
        onChangeText={setPlayerName}
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, !playerName.trim() && styles.buttonDisabled]}
        onPress={startGame}
        disabled={!playerName.trim()}
      >
        <Text style={styles.buttonText}>Start New Game</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={goToHistory}>
        <Text style={styles.buttonText}>View History</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3E5FC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  topLeftTitle: {
    position: 'absolute',
    top: 50,
    left: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    borderColor: '#aaa',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#FFB74D',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
