import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_BASE = 'https://webapi.icydune-a1052ab7.southeastasia.azurecontainerapps.io/api/v1/Quiz';

export default function QuestionScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { sessionId } = route.params as { sessionId: string };

  const [questionList, setQuestionList] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [playerName, setPlayerName] = useState<string>('');
 
  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const name = await AsyncStorage.getItem('playerName');
      if (name) setPlayerName(name);
      await loadQuestions();
    })();
  }, []);

  const loadQuestions = async () => {
    try {
      const questions: any[] = [];
      const seenQuestionIds = new Set();

      while (questions.length < 10) {
        const res = await axios.get(`${API_BASE}/Questions/${sessionId}`);
        const question = res.data.data;
        if (!seenQuestionIds.has(question.questionId)) {
          questions.push(question);
          seenQuestionIds.add(question.questionId);
        }
      }

      setQuestionList(questions);
      setCurrentIndex(0);
      setStartTime(Date.now());
    } catch (err) {
      Alert.alert('โหลดคำถามไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (choice: any) => {
    const currentQuestion = questionList[currentIndex];
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    const payload = {
      sessionId,
      questionId: currentQuestion?.questionId ?? '',
      choiceId: choice?.choiceId ?? '',
      timeSpent,
    };

    if (!payload.sessionId || !payload.questionId || !payload.choiceId) {
      Alert.alert('ข้อมูลไม่ครบ ไม่สามารถส่งคำตอบได้');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/Answer`, payload, {
        headers: {
          'Accept': 'text/plain',
          'Content-Type': 'application/json',
        },
      });

      const result = response.data?.data?.isCorrect ?? false;
      setIsCorrect(result);
      setShowModal(true);

      const historyRaw = await AsyncStorage.getItem('scoreHistory');
      const history = historyRaw ? JSON.parse(historyRaw) : [];

      history.push({
        player: playerName ?? 'Unknown',
        correct: result,
        timeSpent,
        question: currentQuestion.title,
        date: new Date().toISOString(),
      });

      await AsyncStorage.setItem('scoreHistory', JSON.stringify(history));
    } catch (error) {
      Alert.alert('ส่งคำตอบไม่สำเร็จ');
    }
  };

  const handleNext = async () => {
    setShowModal(false);
    const nextIndex = currentIndex + 1;

    if (nextIndex < questionList.length) {
      setCurrentIndex(nextIndex);
      setStartTime(Date.now());
    } else {
     (navigation as any).navigate('screens/SummaryScreen', { sessionId });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const question = questionList[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFDDE1" />
      <Text style={styles.topLeftTitle}>QUIZ ISLAND</Text>

      <View style={styles.card}>
        <Text style={styles.title}>QUESTION {currentIndex + 1}</Text>
        <Text style={styles.question}>{question.title}</Text>

        <View style={styles.choicesContainer}>
          {question.choices.map((choice: any, index: number) => (
            <TouchableOpacity
              key={index}
              style={styles.choiceButton}
              onPress={() => submitAnswer(choice)}
            >
              <Text style={styles.choiceText}>{choice.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Your Answer is</Text>
            <Text style={isCorrect ? styles.modalCorrect : styles.modalInCorrect}>
              {isCorrect ? 'Correct ✅' : 'Incorrect ❌'}
            </Text>
            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>NEXT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  topLeftTitle: {
    position: 'absolute',
    top: 20,
    left: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff69b4',
    marginBottom: 8,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  choicesContainer: {
    width: '100%',
  },
  choiceButton: {
    backgroundColor: '#FFF0F5',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff69b4',
  },
  choiceText: {
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
  },
  modalCorrect: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 24,
  },
  modalInCorrect: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 24,
  },
  nextButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#222',
  },
  nextButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
