/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer, { TRACKS } from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="w-full h-screen bg-[#050505] text-[#e0e0e0] font-sans flex flex-col overflow-hidden border-8 border-[#111]">
      {/* Top Navigation / Stats Bar */}
      <header className="h-16 border-b border-cyan-900/30 bg-[#0a0a0a] flex items-center justify-between px-8 select-none flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-full"></div>
          </div>
          <h1 className="text-xl font-bold tracking-widest text-cyan-400">
            NEON.REPTILE <span className="text-xs font-normal opacity-50 ml-2 uppercase">System v4.2</span>
          </h1>
        </div>
        <div className="flex gap-12 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-cyan-600 uppercase font-semibold tracking-tighter">Live Score</span>
            <span className="text-2xl font-mono text-cyan-400 leading-none">
              {score.toLocaleString('en-US', { minimumIntegerDigits: 6 }).replace(/,/g, ',')}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-pink-600 uppercase font-semibold tracking-tighter">Best Record</span>
            <span className="text-2xl font-mono text-pink-500 leading-none">
              {highScore.toLocaleString('en-US', { minimumIntegerDigits: 6 }).replace(/,/g, ',')}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Playlist */}
        <aside className="w-72 border-r border-cyan-900/20 bg-[#080808] p-6 flex flex-col gap-6 flex-shrink-0">
          <h2 className="text-xs font-bold text-cyan-700 uppercase tracking-widest">Audio Stream</h2>
          <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
            {TRACKS.map((track, index) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(true);
                }}
                className={`p-3 transition-colors border-l-2 flex items-center justify-between group text-left flex-shrink-0 ${
                  currentTrackIndex === index 
                    ? 'bg-cyan-950/20 border-cyan-400' 
                    : 'hover:bg-white/5 border-transparent opacity-60'
                }`}
              >
                <div className="flex flex-col overflow-hidden">
                  <span className={`text-sm font-medium truncate ${currentTrackIndex === index ? 'text-cyan-300' : ''}`}>
                    {track.title}
                  </span>
                  <span className={`text-[10px] truncate ${currentTrackIndex === index ? 'text-cyan-700' : 'opacity-50'}`}>
                    {track.artist}
                  </span>
                </div>
                {currentTrackIndex === index && isPlaying ? (
                  <div className="flex gap-0.5 items-end h-4 flex-shrink-0">
                    <motion.div animate={{ height: [4, 8, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-cyan-400" />
                    <motion.div animate={{ height: [8, 12, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-cyan-400" />
                    <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-cyan-400" />
                  </div>
                ) : (
                  <span className="text-[10px] font-mono opacity-50 flex-shrink-0">03:45</span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-auto">
            <div className="bg-pink-950/10 border border-pink-900/30 p-4 rounded-sm">
              <p className="text-[11px] leading-relaxed text-pink-300/70">
                <strong className="text-pink-400">TIP:</strong> Eating the magenta glitch node increases game speed by 15% and doubles audio bit-rate.
              </p>
            </div>
          </div>
        </aside>

        {/* Center: Game Arena */}
        <section className="flex-1 bg-black relative flex items-center justify-center">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] grid-bg" />
          
          <SnakeGame 
            score={score} 
            onScoreChange={setScore} 
            highScore={highScore}
          />
        </section>

        {/* Right Sidebar: Stats */}
        <aside className="w-60 border-l border-cyan-900/20 bg-[#080808] p-6 flex flex-col gap-8 flex-shrink-0">
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-cyan-700 uppercase tracking-widest">Global Telemetry</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="opacity-50">Neural Load</span>
                <span className="text-cyan-400">{Math.min(99, 40 + Math.floor(score/10))}%</span>
              </div>
              <div className="w-full h-1 bg-cyan-900/30">
                <motion.div 
                  className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                  animate={{ width: `${Math.min(100, 40 + score/10)}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="opacity-50">Game Speed</span>
                <span className="text-cyan-400">{120 + Math.floor(score/20)} bpm</span>
              </div>
              <div className="w-full h-1 bg-cyan-900/30">
                <motion.div 
                  className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                  animate={{ width: `${Math.min(100, (120 + score/20)/300 * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold text-cyan-700 uppercase tracking-widest">Input Visualizer</h2>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-start-2"><KbdKey label="W" /></div>
              <div className="col-start-1 row-start-2"><KbdKey label="A" /></div>
              <div className="row-start-2"><KbdKey label="S" /></div>
              <div className="row-start-2"><KbdKey label="D" /></div>
            </div>
          </div>
        </aside>
      </main>

      {/* Bottom Controller */}
      <MusicPlayer 
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        onTrackChange={setCurrentTrackIndex}
        onPlayPause={setIsPlaying}
      />
    </div>
  );
}

function KbdKey({ label }: { label: string }) {
  return (
    <div className="h-12 border border-cyan-900/30 flex items-center justify-center opacity-40 hover:opacity-100 hover:bg-cyan-500/10 transition-all cursor-default">
      <span className="text-xs font-mono">{label}</span>
    </div>
  );
}
