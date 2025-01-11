import { Audio } from 'expo-av';

let recording: Audio.Recording | null = null;

export const startRecording = async () => {
  try {
    console.log('Requesting permissions..');
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    console.log('Starting recording..');
    const { recording: newRecording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    recording = newRecording;
    console.log('Recording started');
  } catch (err) {
    console.error('Failed to start recording', err);
    throw err;
  }
};

export const stopRecording = async (): Promise<string> => {
  try {
    if (!recording) {
      return '';
    }

    console.log('Stopping recording..');
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);

    recording = null;
    return uri || '';
  } catch (err) {
    console.error('Failed to stop recording', err);
    throw err;
  }
};

export const cancelRecording = async () => {
  try {
    if (recording) {
      await recording.stopAndUnloadAsync();
      recording = null;
    }
  } catch (err) {
    console.error('Failed to cancel recording', err);
  }
}; 