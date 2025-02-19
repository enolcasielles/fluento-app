import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useApiContext } from '@/contexts/api.context';
import { Unit, EvaluationMode } from '@/types/session';
import * as speechService from '@/services/speech.service';
import * as recordingService from '@/services/recording.service';
import { playScoreSound, playStartRecordingSound, playStopRecordingSound } from '@/services/audio.service';
import { QuestionState, ListeningState, AnswerState, ResultState } from '@/components/sections/practice';
import { ManualEvaluationState } from '@/components/sections/practice/ManualEvaluationState';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { typography } from '@/theme/typography';
import { ScreenContainer } from '@/components/layouts/ScreenContainer';

type PracticeState = 'INITING' | 'QUESTION' | 'LISTENING' | 'ANSWER' | 'WAITING_EVALUATION' | 'RESULT' | 'MANUAL_EVALUATION';

export default function PracticeScreen() {
  const router = useRouter();
  const { listId } = useLocalSearchParams();
  const { getListSession, submitResult, evaluateAnswer } = useApiContext();

  const [sessionId, setSessionId] = useState<string>();
  const [currentUnit, setCurrentUnit] = useState<Unit>();
  const [practiceState, setPracticeState] = useState<PracticeState>('INITING');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [score, setScore] = useState<number>();
  const [answer, setAnswer] = useState<string>();
  const [evaluationMode, setEvaluationMode] = useState<EvaluationMode>('auto');
  const isMounted = useRef(true);
  const isEvaluatingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const practiceStateRef = useRef<PracticeState>('INITING');

  useEffect(() => {
    practiceStateRef.current = practiceState;
  }, [practiceState]);

  useEffect(() => {
    isEvaluatingRef.current = isEvaluating;
  }, [isEvaluating]);

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
  }, [practiceState]);

  const updateState = (state: PracticeState) => {
    if (!isMounted.current) return;
    setPracticeState(state);
  };

  const loadSession = async () => {
    try {
      const session = await getListSession(listId as string);
      setSessionId(session.sessionId);
      setCurrentUnit(session.nextUnit);
      setEvaluationMode(session.evaluationMode);
      updateState('QUESTION');
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
    await playText(currentUnit.question.text, 'es');
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      updateState('LISTENING');
    }, 700);
  };

  const handleListeningState = async () => {
    if (!currentUnit) return;
    try {
      // Solo iniciamos grabación en modo auto
      if (evaluationMode === 'auto') {
        await playStartRecordingSound();
        await recordingService.startRecording();
      }
      
      if (!isMounted.current) return;
      timerRef.current = setTimeout(async () => {
        timerRef.current = null;

        // Solo paramos grabación y evaluamos en modo auto
        if (evaluationMode === 'auto') {
          const audioUri = await recordingService.stopRecording();
          if (!isMounted.current) return;

          await playStopRecordingSound();

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
            if (practiceStateRef.current === 'WAITING_EVALUATION') {
              updateState('RESULT');
            }
          } catch (error) {
            console.error('Error evaluating answer:', error);
            setScore(1); // Fallback score en caso de error
          } finally {
            setIsEvaluating(false);
          }
        }

        else {
          if (!isMounted.current) return;
          await playStopRecordingSound();
        }

        updateState('ANSWER');
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
      if (evaluationMode === 'auto') {
        if (isEvaluatingRef.current) updateState('WAITING_EVALUATION');
        else updateState('RESULT');
      } else {
        updateState('MANUAL_EVALUATION');
      }
    }, 700);
  };

  const handleManualScore = async (selectedScore: number) => {
    setScore(selectedScore);
    updateState('RESULT');
  };

  const handleResultState = async () => {
    if (!currentUnit || !sessionId || !score) return;
    try {
      playScoreSound(score);
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
    <ScreenContainer>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.exitButton}
          onPress={handleExit}
          activeOpacity={0.8}
        >
          <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
          <Text style={styles.exitText}>Finalizar práctica</Text>
        </TouchableOpacity>

        {currentUnit && (
          <View style={styles.content}>
            {practiceState === 'QUESTION' && (
              <QuestionState text={currentUnit.question.text} />
            )}

            {practiceState === 'LISTENING' && (
              <ListeningState remainingTime={currentUnit.responseTime} />
            )}

            {practiceState === 'ANSWER' && (
              <AnswerState 
                text={currentUnit.answer.text} 
                isEvaluating={isEvaluating} 
              />
            )}

            {practiceState === 'WAITING_EVALUATION' && (
              <AnswerState 
                text={currentUnit.answer.text} 
                isEvaluating={true} 
              />
            )}

            {practiceState === 'MANUAL_EVALUATION' && (
              <ManualEvaluationState onSelectScore={handleManualScore} />
            )}

            {practiceState === 'RESULT' && score && (
              <ResultState score={score} />
            )}
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  } as ViewStyle,
  exitButton: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.md,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.large,
    gap: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  exitText: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  } as TextStyle,
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
});