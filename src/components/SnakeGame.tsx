import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

interface SnakeGameProps {
  score: number;
  onScoreChange: (score: number) => void;
  highScore: number;
}

export default function SnakeGame({ score, onScoreChange, highScore }: SnakeGameProps) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: { x: number, y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isCollision = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isCollision) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    onScoreChange(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check self-collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        onScoreChange(score + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood, score, onScoreChange]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const speed = Math.max(100, 200 - Math.floor(score / 50) * 10);
    if (!isPaused && !gameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, gameOver, score]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative border border-cyan-500/30 bg-[#020202] shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden">
        {/* Scanning Line */}
        <motion.div 
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[2px] bg-cyan-500/10 z-10 pointer-events-none"
        />

        <div 
          className="grid gap-[1px]" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            const snakeIndex = snake.findIndex(s => s.x === x && s.y === y);

            return (
              <div 
                key={i}
                className={`w-5 h-5 transition-all duration-200 ${
                  isSnake 
                    ? snakeIndex === 0
                      ? 'bg-cyan-400 shadow-[0_0_10px_#06b6d4] z-10' 
                      : 'bg-cyan-400'
                    : isFood
                      ? 'bg-pink-500 shadow-[0_0_15px_#ec4899] animate-pulse'
                      : 'bg-transparent'
                }`}
                style={isSnake && snakeIndex > 0 ? { opacity: Math.max(0.2, 1 - (snakeIndex * 0.1)) } : {}}
              />
            );
          })}
        </div>

        <AnimatePresence>
          {(isPaused || gameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-[2px]"
            >
              {gameOver ? (
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-black text-pink-500 tracking-widest uppercase">CONNECTION_LOST</h2>
                  <p className="text-zinc-500 font-mono text-xs">FINAL_TELEMETRY: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="px-8 py-2 border border-pink-500 text-pink-500 hover:bg-pink-500/10 transition-all font-mono text-xs tracking-widest"
                  >
                    REBOOT
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-black text-cyan-400 tracking-widest uppercase">STANDBY</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="flex items-center gap-2 px-10 py-3 border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 transition-all font-mono text-xs tracking-widest"
                  >
                    <Play size={14} fill="currentColor" /> ENGAGE
                  </button>
                  <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.2em]">Ready for Phase {Math.floor(score/100) + 1}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
