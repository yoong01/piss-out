import { useAudioPlayer } from 'expo-audio';

const plopSource = require('../../assets/sounds/plop.wav');
const flushSource = require('../../assets/sounds/flush.wav');

/**
 * Toilet-themed SFX. `plop` = notification/tap feedback, `flush` = success/completion.
 * Call the hook once per screen that needs sound and reuse the returned players.
 */
export function useSoundEffects() {
  const plopPlayer = useAudioPlayer(plopSource);
  const flushPlayer = useAudioPlayer(flushSource);

  const playPlop = () => {
    plopPlayer.seekTo(0);
    plopPlayer.play();
  };

  const playFlush = () => {
    flushPlayer.seekTo(0);
    flushPlayer.play();
  };

  return { playPlop, playFlush };
}
