import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion } from 'motion/react';

export const TRACKS = [
  {
    id: 1,
    title: "Synthetic Horizon",
    artist: "AI Core Alpha",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Voltage Pulse",
    artist: "Neural Weaver",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Bit-Depth Void",
    artist: "Logic Ghost",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop"
  }
];

interface MusicPlayerProps {
  currentTrackIndex: number;
  isPlaying: boolean;
  onTrackChange: (index: number) => void;
  onPlayPause: (playing: boolean) => void;
}

export default function MusicPlayer({ 
  currentTrackIndex, 
  isPlaying, 
  onTrackChange, 
  onPlayPause 
}: MusicPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("03:45");
  const [currentTime, setCurrentTime] = useState("00:00");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => onPlayPause(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, onPlayPause]);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
      setCurrentTime(formatTime(audioRef.current.currentTime));
      if (audioRef.current.duration) {
        setDuration(formatTime(audioRef.current.duration));
      }
    }
  };

  const skipForward = () => {
    onTrackChange((currentTrackIndex + 1) % TRACKS.length);
    onPlayPause(true);
  };

  const skipBack = () => {
    onTrackChange((currentTrackIndex - 1 + TRACKS.length) % TRACKS.length);
    onPlayPause(true);
  };

  return (
    <footer className="h-20 border-t border-cyan-900/30 bg-[var(--color-dark-panel)] px-8 flex items-center gap-12 z-50">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />
      
      {/* Now Playing info */}
      <div className="flex items-center gap-4 w-64 flex-shrink-0">
        <div className="w-12 h-12 bg-zinc-900 border border-cyan-500/20 flex items-center justify-center overflow-hidden">
          {isPlaying ? (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-cyan-400 rounded-full border-t-transparent"
            />
          ) : (
            <div className="w-6 h-6 border-2 border-cyan-400/30 rounded-full" />
          )}
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-bold text-cyan-400 truncate uppercase tracking-tighter">
            {currentTrack.title}
          </span>
          <span className="text-[10px] opacity-50 uppercase truncate">Now Streaming</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={skipBack}
            className="opacity-40 hover:opacity-100 transition-opacity"
          >
            <SkipBack size={16} fill="white" />
          </button>
          <button 
            onClick={() => onPlayPause(!isPlaying)}
            className="w-10 h-10 border border-cyan-400 flex items-center justify-center bg-cyan-400/5 hover:bg-cyan-400/20 transition-all active:scale-95"
          >
            {isPlaying ? (
              <Pause size={20} fill="#22d3ee" className="text-cyan-400" />
            ) : (
              <Play size={20} fill="#22d3ee" className="text-cyan-400 ml-1" />
            )}
          </button>
          <button 
            onClick={skipForward}
            className="opacity-40 hover:opacity-100 transition-opacity"
          >
            <SkipForward size={16} fill="white" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono opacity-40">{currentTime}</span>
          <div className="flex-1 h-1 bg-zinc-800 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <span className="text-[10px] font-mono opacity-40">{duration}</span>
        </div>
      </div>

      {/* Visualizer and Volume */}
      <div className="w-48 flex items-center gap-4 flex-shrink-0">
        <div className="flex gap-0.5 h-8 items-end">
          {[0.4, 0.7, 1.0, 0.8, 0.6, 0.9, 0.5].map((h, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? { height: [`${h*100}%`, `${(1-h)*100}%`, `${h*100}%`] } : { height: `${h*100}%` }}
              transition={{ duration: 0.5 + i * 0.1, repeat: Infinity, repeatType: "reverse" }}
              className="w-1 bg-cyan-400"
              style={{ opacity: 0.5 + h/2 }}
            />
          ))}
        </div>
        <div className="flex-1 h-0.5 bg-zinc-800 relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]"></div>
        </div>
      </div>
    </footer>
  );
}
