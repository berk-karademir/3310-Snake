import { useState, useEffect, useCallback } from 'react'

const GRID_SIZE = { x: 31, y: 21 }
const CELL_SIZE = 10
const INITIAL_SNAKE = [
  { x: 8, y: 8 },
  { x: 8, y: 9 },
  { x: 8, y: 10 }
]
const INITIAL_DIRECTION = { x: 0, y: -1 }
const GAME_SPEED = 150

export default function GameBoard() {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [food, setFood] = useState({ x: 5, y: 5 })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE.x),
      y: Math.floor(Math.random() * GRID_SIZE.y)
    }
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood()
    }
    return newFood
  }, [snake])

  const startGame = () => {
    setGameStarted(true)
    setSnake(INITIAL_SNAKE)
    setDirection(INITIAL_DIRECTION)
    setFood(generateFood())
    setScore(0)
    setGameOver(false)
  }

  const resetGame = () => {
    setGameStarted(false)
    setGameOver(false)
  }

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) return

    const newSnake = [...snake]
    const head = {
      x: (newSnake[0].x + direction.x + GRID_SIZE.x) % GRID_SIZE.x,
      y: (newSnake[0].y + direction.y + GRID_SIZE.y) % GRID_SIZE.y
    }

    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true)
      return
    }

    newSnake.unshift(head)

    if (head.x === food.x && head.y === food.y) {
      setScore(score + 10)
      setFood(generateFood())
    } else {
      newSnake.pop()
    }

    setSnake(newSnake)
  }, [snake, direction, food, gameOver, gameStarted, score, generateFood])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) {
        if (e.key === 'Enter' || e.key === '5') resetGame()
        return
      }

      if (!gameStarted) {
        if (e.key === 'Enter' || e.key === '5') startGame()
        return
      }

      const keyDirections = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        '8': { x: 0, y: -1 }, // Up
        '2': { x: 0, y: 1 },  // Down
        '4': { x: -1, y: 0 }, // Left
        '6': { x: 1, y: 0 },  // Right
      }

      const newDirection = keyDirections[e.key]

      if (newDirection) {
        const isOpposite = (
          newDirection.x === -direction.x && direction.x !== 0 ||
          newDirection.y === -direction.y && direction.y !== 0
        )
        if (!isOpposite) {
          setDirection(newDirection)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    const gameInterval = setInterval(moveSnake, GAME_SPEED)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      clearInterval(gameInterval)
    }
  }, [direction, gameOver, gameStarted, moveSnake])

  const renderPixel = (color) => (
    <div className={`w-[2px] h-[2px] ${color}`}></div>
  )

  const renderPixelText = (text, textColor = 'bg-[#2d3436]') => {
    const pixelChars = {
      S: [
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [0,0,1],
        [1,1,1]
      ],
      N: [
        [1,0,1],
        [1,1,1],
        [1,1,1],
        [1,0,1],
        [1,0,1]
      ],
      A: [
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,0,1]
      ],
      K: [
        [1,0,1],
        [1,1,0],
        [1,1,0],
        [1,0,1],
        [1,0,1]
      ],
      E: [
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [1,0,0],
        [1,1,1]
      ],
      T: [
        [1,1,1],
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [0,1,0]
      ],
      R: [
        [1,1,1],
        [1,0,1],
        [1,1,0],
        [1,0,1],
        [1,0,1]
      ]
    }

    return (
      <div className="flex space-x-1">
        {text.split('').map((char, charIndex) => (
          <div key={charIndex} className="flex flex-col">
            {pixelChars[char].map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((pixel, pixelIndex) => (
                  <div key={pixelIndex}>
                    {pixel ? renderPixel(textColor) : renderPixel('bg-transparent')}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative bg-[#787C6D] w-full h-full overflow-hidden flex flex-col justify-center items-center">
      {!gameStarted && !gameOver && (
        <div className="flex flex-col items-center space-y-4">
          {renderPixelText('SNAKE')}
          <button
            onClick={startGame}
            className="mt-4 px-2 py-1 bg-[#2d3436] text-[#9DCFB1] text-xs font-bold rounded"
          >
            {renderPixelText('START', 'bg-[#9DCFB1]')}
          </button>
        </div>
      )}
      
      {(gameStarted || gameOver) && (
        <>
          {/* Score display */}
          <div className="absolute top-1 left-1 font-mono text-[#2d3436] text-[10px]">
            {score.toString().padStart(4, '0')}
          </div>
          
          {/* Game grid */}
          <div className="relative w-full h-full">
            {/* Food */}
            <div
              className="absolute w-[10px] h-[10px] bg-[#2d3436]"
              style={{
                left: `${food.x * CELL_SIZE}px`,
                top: `${food.y * CELL_SIZE}px`
              }}
            />
            
            {/* Snake */}
            {snake.map((segment, index) => (
              <div
                key={index}
                className="absolute w-[10px] h-[10px] bg-[#2d3436]"
                style={{
                  left: `${segment.x * CELL_SIZE}px`,
                  top: `${segment.y * CELL_SIZE}px`
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Game Over overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
          <div className="text-[#2d3436] text-[20px] font-mono mb-1">Game Over!</div>
          <div className="text-[#2d3436] text-[20px] font-mono mb-1">Score: {score}</div>
          <div className="text-[#2d3436] text-[10px] font-mono">
            Press 5 to Restart
          </div>
        </div>
      )}
    </div>
  )
}