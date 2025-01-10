import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useApiContext } from '@/contexts/api.context';
import { Unit } from '@/types/session';
import * as speechService from '@/services/speech.service';

type PracticeState = 'QUESTION' | 'LISTENING' | 'ANSWER' | 'RESULT';

export default function PracticeScreen() {
  const router = useRouter();
  const { listId } = useLocalSearchParams();
  const { getListSession, submitResult } = useApiContext();

  const [sessionId, setSessionId] = useState<string>();
  const [currentUnit, setCurrentUnit] = useState<Unit>();
  const [practiceState, setPracticeState] = useState<PracticeState>('QUESTION');
  const [score, setScore] = useState<number>();

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const session = await getListSession(listId as string);
      setSessionId(session.sessionId);
      setCurrentUnit(session.nextUnit);
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const playText = async (text: string, language: string) => {
    try {
      await speechService.speak(text, { language });
    } catch (error) {
      console.error('Error playing text:', error);
    }
  };

  const handleQuestionState = async () => {
    if (!currentUnit) return;
    await playText(currentUnit.question.text, 'en');
    setTimeout(() => {
      setPracticeState('LISTENING');
    }, 700);
  };

  const handleListeningState = () => {
    if (!currentUnit) return;
    setTimeout(() => {
      setPracticeState('ANSWER');
    }, currentUnit.responseTime);
  };

  const handleAnswerState = async () => {
    if (!currentUnit) return;
    // TODO: Implementar evaluación del audio
    const mockScore = Math.floor(Math.random() * 4) + 1;
    setScore(mockScore);
    await playText(currentUnit.answer.text, 'en');
    setTimeout(() => {
      setPracticeState('RESULT');
    }, 700);
  };

  const handleResultState = async () => {
    if (!currentUnit || !sessionId || !score) return;
    try {
      const result = await submitResult(sessionId, currentUnit.id, score);
      setCurrentUnit(result.nextUnit);
      setScore(undefined);
      setPracticeState('QUESTION');
    } catch (error) {
      console.error('Error submitting result:', error);
    }
  };

  useEffect(() => {
    console.log('practiceState', practiceState);
    switch (practiceState) {
      case 'QUESTION':
        handleQuestionState();
        break;
      case 'LISTENING':
        handleListeningState();
        break;
      case 'ANSWER':
        handleAnswerState();
        break;
      case 'RESULT':
        handleResultState();
        break;
    }
  }, [practiceState, currentUnit]);

  const handleExit = () => {
    router.back();
  };

  const getScoreText = (score: number) => {
    switch (score) {
      case 1:
        return 'Necesitas practicar más';
      case 2:
        return 'Puedes mejorar';
      case 3:
        return '¡Muy bien!';
      case 4:
        return '¡Perfecto!';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.exitButton} onPress={handleExit}>
        <Text style={styles.exitText}>Salir</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.exitButton, { top: 60 }]} 
        onPress={async () => {
          console.log('Testing speech...');
          try {
            await playText('Hello', 'en');
            console.log('Speech test completed');
          } catch (error) {
            console.error('Test error:', error);
          }
        }}>
        <Text style={styles.exitText}>Test Audio</Text>
      </TouchableOpacity>

      {currentUnit && (
        <View style={styles.content}>
          {practiceState === 'QUESTION' && (
            <View style={styles.card}>
              <Text style={styles.text}>{currentUnit.question.text}</Text>
            </View>
          )}

          {practiceState === 'LISTENING' && (
            <View style={styles.card}>
              <Text style={styles.text}>Es tu turno, traduce la frase</Text>
            </View>
          )}

          {practiceState === 'ANSWER' && (
            <View style={styles.card}>
              <Text style={styles.text}>{currentUnit.answer.text}</Text>
            </View>
          )}

          {practiceState === 'RESULT' && score && (
            <View style={styles.card}>
              <Text style={styles.text}>{getScoreText(score)}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  exitButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  exitText: {
    fontSize: 16,
    color: '#64748B',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    maxWidth: 480,
  },
  text: {
    fontSize: 20,
    color: '#1E293B',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
});