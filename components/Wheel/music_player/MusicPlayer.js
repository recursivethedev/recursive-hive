import { useEffect, useRef } from 'react';

import styles from './MusicPlayer.module.css';

const playlist = ['ES_Full_Time_Lover_-_Gerhard_Feng',
                  'ES_Glitz_At_The_Ritz_-_Jules_Gaia',
                  'ES_Go_Cat_Go_-_Martin_Landstrom',
                  'ES_Las_Vegas_Police_-_White_Bones',
                  'ES_Midnight_Strides_-_Beck_and_Call',
                  'ES_Oh_Please_-_Gerhard_Feng']

export default function MusicPlayer({ soundtrackRef, audioContext, isPlaying, setIsPlaying }) {

  const buttonRef = useRef();

  useEffect(() => {

    if (typeof audioContext.current === "undefined") {
      soundtrackRef.current.src = `/wheel/music_player/${playlist[Math.floor(Math.random() * playlist.length)]}.mp3`;

      const AudioContext = window.AudioContext || window.webkitAudioContext;

      audioContext.current = new AudioContext();
      const track = audioContext.current.createMediaElementSource(soundtrackRef.current);
      track.connect(audioContext.current.destination);
    }

    const setAsPlaying = () => {
      setIsPlaying('playing');
    }

    const setAsPaused = () => {
      setIsPlaying('paused');
    }

    soundtrackRef.current.addEventListener('ended', playNextTrack);
    soundtrackRef.current.addEventListener('play', setAsPlaying);
    soundtrackRef.current.addEventListener('pause', setAsPaused);

    return () => {
      soundtrackRef.current.removeEventListener('ended', playNextTrack);
      soundtrackRef.current.removeEventListener('play', setAsPlaying);
      soundtrackRef.current.removeEventListener('pause', setAsPaused);
    }

  }, []);

  function playNextTrack() {
    soundtrackRef.current.src = `/wheel/music_player/${playlist[Math.floor(Math.random() * playlist.length)]}.mp3`;
    soundtrackRef.current.play();
  }

  function handlePlayPause() {
    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }
    if (isPlaying === 'paused' || isPlaying === 'initial') {
      soundtrackRef.current.play();
      setIsPlaying('playing');
    }
    else {
      soundtrackRef.current.pause();
      setIsPlaying('paused');
    }
  }

  const musicPlaying = (typeof soundtrackRef.current === 'undefined' || soundtrackRef.current.paused) ? false : true;

  return (
    <>
      <audio src="" ref={soundtrackRef} />
      <button aria-label={musicPlaying ? "pause music" : "play music"} role="switch" aria-checked={musicPlaying ? "true" : "false"} className={styles.muteButton} onClick={handlePlayPause} ref={buttonRef}>
        {musicPlaying ?
          <>
            <div className={styles.playerBlurredLights} />
            <img src="/wheel/music_player/volume.svg" alt="volume icon" className={styles.muteButtonIcon} />
          </>
          :
          <img src="/wheel/music_player/volume_mute.svg" alt="mute icon" className={styles.muteButtonIcon} />
        }
      </button>
    </>
  );
}
