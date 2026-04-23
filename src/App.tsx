import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="w-screen h-screen bg-[#050508] text-white flex flex-col font-sans overflow-hidden border-4 border-[#1a1a2e]">
      
      <header className="h-16 flex flex-shrink-0 items-center justify-between px-8 border-b border-[#1a1a2e] bg-[#0a0a14]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#00f2ff] shadow-[0_0_15px_#00f2ff]"></div>
          <h1 className="text-xl font-bold tracking-widest text-[#00f2ff]">NEON<span className="text-[#ff007f]">SERPENT</span></h1>
        </div>
        <div className="flex gap-8 items-center font-mono text-sm">
          <div className="flex gap-2">
            <span className="text-gray-500">STATUS:</span>
            <span className="text-[#00ff41]">OPERATIONAL</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <section className="flex-1 relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_#111122_0%,_#050508_100%)]">
          <SnakeGame />
        </section>
      </main>

      <MusicPlayer />
      
    </div>
  );
}

