import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };
type GameState = 'START' | 'PLAYING' | 'GAME_OVER';

const GRID_SIZE = 25;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 15 },
  { x: 10, y: 16 },
  { x: 10, y: 17 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const BASE_SPEED = 150;

function randomFoodPosition(snake: Point[]): Point {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on the snake
    const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!onSnake) break;
  }
  return newFood;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Refs to handle avoiding duplicate keypresses or stale state in closures
  const directionRef = useRef(direction);
  const nextDirectionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameState('PLAYING');
    setFood(randomFoodPosition(INITIAL_SNAKE));
  };

  const gameOver = () => {
    setGameState('GAME_OVER');
    if (score > highScore) {
      setHighScore(score);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only prevent default for arrow keys to avoid scrolling while playing
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      if (gameState !== 'PLAYING') {
        if (e.key === 'Enter' || e.key === ' ') {
          startGame();
        }
        return;
      }

      const currentDir = directionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, score]);

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const currentSpeed = Math.max(BASE_SPEED - Math.floor(score / 5) * 10, 50);

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const currentDir = nextDirectionRef.current;
        setDirection(currentDir);

        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y,
        };

        // Check walls (wrap around or die? Let's do wrap around for cooler retro feel, OR die for classic. Classic die is harder.)
        // We'll do die for classic challenge.
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          gameOver();
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          gameOver();
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(randomFoodPosition(newSnake));
          // Don't pop, snake grows
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, currentSpeed);
    return () => clearInterval(intervalId);
  }, [gameState, food, score]);

  return (
    <>
      <div className="absolute top-10 flex gap-12 font-mono z-20">
        <div className="text-center px-6 py-2 border border-[#1a1a2e] bg-[#0a0a14]/80">
          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Current Score</p>
          <p className="text-3xl font-bold text-[#00f2ff]">{score.toString().padStart(4, '0')}</p>
        </div>
        <div className="text-center px-6 py-2 border border-[#1a1a2e] bg-[#0a0a14]/80">
          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Top Record</p>
          <p className="text-3xl font-bold text-white">{highScore.toString().padStart(4, '0')}</p>
        </div>
      </div>

      <div 
        className="w-[500px] h-[500px] border-2 border-[#1a1a2e] relative bg-[#070714]"
      >
        {/* Grid Background */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(#1a1a2e 1px, transparent 1px), linear-gradient(90deg, #1a1a2e 1px, transparent 1px)',
          backgroundSize: `${500/GRID_SIZE}px ${500/GRID_SIZE}px`
        }} />

        {/* Game Entities */}
        {gameState === 'PLAYING' && (
          <div className="absolute inset-0 z-10 top-0 left-0">
            {/* Food */}
            <div 
              className="absolute bg-[#ff007f] rounded-full shadow-[0_0_20px_#ff007f] animate-pulse"
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(food.x / GRID_SIZE) * 100}%`,
                top: `${(food.y / GRID_SIZE) * 100}%`,
              }}
            />
            {/* Snake */}
            {snake.map((segment, index) => {
              const isHead = index === 0;
              return (
                <div 
                  key={`${segment.x}-${segment.y}-${index}`}
                  className={`absolute rounded-sm ${isHead ? 'bg-[#00ff41] z-20 shadow-[0_0_15px_#00ff41]' : 'bg-[#00ff41]'}`}
                  style={{
                    width: `${100 / GRID_SIZE}%`,
                    height: `${100 / GRID_SIZE}%`,
                    left: `${(segment.x / GRID_SIZE) * 100}%`,
                    top: `${(segment.y / GRID_SIZE) * 100}%`,
                    opacity: isHead ? 1 : Math.max(0.2, 0.8 - index * 0.05)
                  }}
                />
              )
            })}
          </div>
        )}

        {/* Overlays */}
        {gameState === 'START' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#070714]/80 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-[#00f2ff] mb-6 tracking-widest text-center">CYBER<br/><span className="text-[#ff007f]">SERPENT</span></h2>
            <button 
              onClick={startGame}
              className="px-8 py-3 bg-[#16162a] text-white font-bold tracking-wider rounded border border-[#ff007f] hover:bg-[#ff007f]/20 hover:shadow-[0_0_15px_rgba(255,0,127,0.4)] transition-all"
            >
              INITIALIZE SYNC
            </button>
            <p className="mt-4 text-gray-500 text-xs font-mono tracking-widest">AWAITING INPUT (WASD/ARROWS)</p>
          </div>
        )}

        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050508]/90 backdrop-blur-sm">
            <h2 className="text-4xl font-bold text-[#ff007f] mb-2 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,0,127,0.5)]">SYSTEM FAILURE</h2>
            <button 
              onClick={startGame}
              className="mt-8 px-8 py-3 bg-[#16162a] text-white font-bold tracking-wider rounded border border-[#00f2ff] hover:bg-[#00f2ff]/20 hover:shadow-[0_0_15px_rgba(0,242,255,0.4)] transition-all"
            >
              RESTART SEQUENCE
            </button>
          </div>
        )}
      </div>
    </>
  );
}
