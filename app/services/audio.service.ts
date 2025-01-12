import { delay } from '@/utils/delay';
import { Audio } from 'expo-av';

const startRecordingSoundUri = require('@/assets/sounds/start-recording.mp3');
const stopRecordingSoundUri = require('@/assets/sounds/stop-recording.mp3');
const score4SoundUri = require('@/assets/sounds/score-4.wav');
const score3SoundUri = require('@/assets/sounds/score-3.wav');
const score2SoundUri = require('@/assets/sounds/score-2.wav');
const score1SoundUri = require('@/assets/sounds/score-1.wav');

const playSound = async (uri: any, time: number) => {
  return new Promise(async (resolve) => {
    const { sound } = await Audio.Sound.createAsync(uri);
    await sound.playAsync();
    await delay(time);
    await sound.unloadAsync();
    resolve(true);
  });
}

export const playStartRecordingSound = async () => {
  await playSound(startRecordingSoundUri, 300);
}

export const playStopRecordingSound = async () => {
  await playSound(stopRecordingSoundUri, 300);
}

export const playScoreSound = async (score: number) => {
  switch (score) {
    case 4:
      await playSound(score4SoundUri, 300);
      break;
    case 3:
      await playSound(score3SoundUri, 300);
      break;
    case 2:
      await playSound(score2SoundUri, 300);
      break;
    case 1:
      await playSound(score1SoundUri, 300);
      break;
  }
} 

