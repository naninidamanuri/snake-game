import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Drift (AI Demo #1)',
    artist: 'Neural Network',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    id: 2,
    title: 'Cyber Synth (AI Demo #2)',
    artist: 'Deep Groove',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  },
  {
    id: 3,
    title: 'Digital Horizon (AI Demo #3)',
    artist: 'Algorithmic Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayMode = () => {
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    skipForward();
  };

  return (
    <footer className="flex-shrink-0 h-24 bg-[#0a0a14] border-t border-[#1a1a2e] px-8 flex items-center justify-between">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-6 w-1/3">
        <div className="w-12 h-12 bg-[#16162a] border border-[#ff007f] flex items-center justify-center">
          <Music className="text-[#ff007f] w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-bold text-white">{currentTrack.title}</p>
          <p className="text-xs text-gray-500">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 flex-1">
        <div className="flex items-center gap-8">
          <button 
            onClick={skipBackward}
            className="text-gray-400 hover:text-white transition-colors focus:outline-none"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            onClick={togglePlayMode}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:bg-[#00f2ff] transition-colors focus:outline-none"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>

          <button 
            onClick={skipForward}
            className="text-gray-400 hover:text-white transition-colors focus:outline-none"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
        <div className="w-[400px] h-1 bg-[#1a1a2e] rounded-full relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 bg-white" style={{ width: isPlaying ? '80%' : '50%', transition: 'width 2s ease' }}></div>
        </div>
      </div>

      <div className="w-1/3 flex justify-end gap-2 items-center">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-gray-400 hover:text-white transition-colors focus:outline-none"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <div className="w-24">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#1a1a2e] rounded-lg appearance-none cursor-pointer accent-white hover:accent-[#00f2ff]"
          />
        </div>
      </div>
    </footer>
  );
}
