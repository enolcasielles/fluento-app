import { InterruptionModeAndroid } from 'expo-av';
import { InterruptionModeIOS } from 'expo-av';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

interface SpeakOptions {
  language?: string;
  rate?: number;
  pitch?: number;
}

let availableVoices: Speech.Voice[] = [];
let selectedVoicesForLanguage: { [key: string]: Speech.Voice | null } = {};

const initVoices = async () => {
  if (availableVoices.length === 0) {
    try {
      availableVoices = await Speech.getAvailableVoicesAsync();
    } catch (error) {
      console.error('Error initializing speech service:', error);
      throw error;
    }
  }
};

const findVoiceForLanguage = (language?: string) => {
  if (!language) return null;

  if (selectedVoicesForLanguage[language]) {
    return selectedVoicesForLanguage[language];
  }
  
  // Primero intentamos encontrar una voz compact (son más estables en iOS)
  let voice = availableVoices.find(v => 
    v.language.toLowerCase().startsWith(language.toLowerCase()) &&
    v.identifier.toLowerCase().includes('compact')
  );

  // Si no hay voces compact, usamos cualquier otra
  if (!voice) {
    voice = availableVoices.find(v => 
      v.language.toLowerCase().startsWith(language.toLowerCase())
    );
  }

  selectedVoicesForLanguage[language] = voice;

  return voice;
};

export const speak = async (text: string, options?: SpeakOptions) => {
  console.log('speaking', text, options);
  
  try {
    // Configuramos el modo de audio antes de reproducir
    await initVoices();
    const voice = findVoiceForLanguage(options?.language);
    console.log('Selected voice:', voice);
    
    if (!voice) {
      console.warn('No voice found for language:', options?.language);
    }

    return new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Speech timeout'));
      }, 10000);

      try {
        Speech.speak(text, {
          language: voice?.language || options?.language,
          voice: voice?.identifier,
          rate: 1.0,
          pitch: 1.0,
          onStart: () => {
            console.log('Started speaking');
          },
          onDone: () => {
            console.log('Done speaking');
            clearTimeout(timeoutId);
            resolve();
          },
          onStopped: () => {
            console.log('Stopped speaking');
            clearTimeout(timeoutId);
            resolve();
          },
          onError: (error) => {
            console.error('Error speaking:', error);
            clearTimeout(timeoutId);
            reject(error);
          },
        });
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  } catch (error) {
    console.error('Error in speak:', error);
    throw error;
  }
};

export const stop = async () => {
  await Speech.stop();
}; 