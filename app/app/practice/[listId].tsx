import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useApiContext } from '@/contexts/api.context';
import { Unit } from '@/types/session';
import * as speechService from '@/services/speech.service';
import * as recordingService from '@/services/recording.service';

type PracticeState = 'QUESTION' | 'LISTENING' | 'ANSWER' | 'RESULT';

export default function PracticeScreen() {
  const router = useRouter();
  const { listId } = useLocalSearchParams();
  const { getListSession, submitResult, evaluateAnswer } = useApiContext();

  const [sessionId, setSessionId] = useState<string>();
  const [currentUnit, setCurrentUnit] = useState<Unit>();
  const [practiceState, setPracticeState] = useState<PracticeState>('QUESTION');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [score, setScore] = useState<number>();
  const [answer, setAnswer] = useState<string>();
  const isMounted = useRef(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const practiceStateRef = useRef<PracticeState>('QUESTION');

  useEffect(() => {
    practiceStateRef.current = practiceState;
  }, [practiceState]);

  useEffect(() => {
    loadSession();
    return () => {
      speechService.stop();
      recordingService.stopRecording();
      isMounted.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, []);

  const updateState = (state: PracticeState) => {
    if (!isMounted.current) return;
    setPracticeState(state);
  };

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

  const initRecording = async () => {
    try {
      if (!isMounted.current) return;
      await recordingService.startRecording();
      updateState('LISTENING');
    } catch (error) {
      console.error('Error initializing recording:', error);
    }
  }

  const handleQuestionState = async () => {
    if (!currentUnit) return;
    await playText(currentUnit.question.text, 'es');
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      initRecording();
    }, 700);
  };

  const handleListeningState = async () => {
    if (!currentUnit) return;
    try {
      timerRef.current = setTimeout(async () => {
        timerRef.current = null;
        const audioUri = await recordingService.stopRecording();
        if (!isMounted.current) return;

        updateState('ANSWER');

        // Evaluar la respuesta
        setIsEvaluating(true);
        
        // Crear FormData con el audio
        const formData = new FormData();
        formData.append('audio', {
          uri: audioUri,
          type: 'audio/m4a',
          name: 'recording.m4a'
        } as any);
        try {
          const result = await evaluateAnswer(sessionId, currentUnit.id, formData);
          console.log('Result:', result);
          setScore(result.score);
          setAnswer(result.answer);
          if (practiceStateRef.current === 'RESULT') handleResultState();
        } catch (error) {
          console.error('Error evaluating answer:', error);
          setScore(1); // Fallback score en caso de error
        } finally {
          setIsEvaluating(false);
        }
      }, currentUnit.responseTime);
    } catch (error) {
      console.error('Error in listening state:', error);
      updateState('ANSWER');
    }
  };

  const handleAnswerState = async () => {
    if (!currentUnit) return;
    await playText(currentUnit.answer.text, 'en');
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      updateState('RESULT');
    }, 700);
  };

  const handleResultState = async () => {
    if (!currentUnit || !sessionId || !score) return;
    try {
      const result = await submitResult(sessionId, currentUnit.id, score, answer);
      setScore(undefined);
      setAnswer(undefined);
      setCurrentUnit(result.nextUnit);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        updateState('QUESTION');
      }, 700);
    } catch (error) {
      console.error('Error submitting result:', error);
    }
  };

  useEffect(() => {
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

  const handleExit = async () => {
    await recordingService.stopRecording();
    await speechService.stop();
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

      {currentUnit && (
        <View style={styles.content}>
          {practiceState === 'QUESTION' && (
            <View style={styles.card}>
              <Text style={styles.text}>{currentUnit.question.text}</Text>
            </View>
          )}

          {practiceState === 'LISTENING' && (
            <View style={styles.card}>
              <View style={styles.recordingIndicator} />
              <Text style={styles.text}>Es tu turno, traduce la frase</Text>
            </View>
          )}

          {practiceState === 'ANSWER' && (
            <View style={styles.card}>
              <Text style={styles.text}>{currentUnit.answer.text}</Text>
              {isEvaluating && (
                <View style={styles.evaluatingContainer}>
                  <ActivityIndicator size="large" color="#2563EB" />
                  <Text style={styles.evaluatingText}>Evaluando respuesta...</Text>
                </View>
              )}
            </View>
          )}

          {practiceState === 'RESULT' && (
            <View style={styles.card}>
              {score && (
                <Text style={styles.text}>{getScoreText(score)}</Text>
              )}
              {isEvaluating && (
                <View style={styles.evaluatingContainer}>
                  <ActivityIndicator size="large" color="#2563EB" />
                  <Text style={styles.evaluatingText}>Evaluando respuesta...</Text>
                </View>
              )}
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
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#1E293B',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    marginBottom: 16,
  },
  evaluatingContainer: {
    alignItems: 'center',
  },
  evaluatingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    fontFamily: 'Inter',
  },
});