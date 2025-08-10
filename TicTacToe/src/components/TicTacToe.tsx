'use client'

import { useState, useEffect } from 'react'

type Player = 'X' | 'O' | null
type Board = Player[]
type GameMode = 'pvp' | 'ai'

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X')
  const [winner, setWinner] = useState<Player>(null)
  const [gameOver, setGameOver] = useState(false)
  const [playerMoves, setPlayerMoves] = useState<{X: number[], O: number[]}>({X: [], O: []})
  const [showModal, setShowModal] = useState(false)
  const [gameMode, setGameMode] = useState<GameMode>('pvp')
  const [isAiTurn, setIsAiTurn] = useState(false)

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Yatay
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Dikey
    [0, 4, 8], [2, 4, 6] // Çapraz
  ]

  // Modal'ı 3 saniye sonra kapat
  useEffect(() => {
    if (winner) {
      setShowModal(true)
      const timer = setTimeout(() => {
        setShowModal(false)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [winner])

  // AI hamlesi
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'O' && !winner && !gameOver) {
      setIsAiTurn(true)
      const timer = setTimeout(() => {
        makeAiMove()
        setIsAiTurn(false)
      }, 1000) // 1 saniye bekle
      
      return () => clearTimeout(timer)
    }
  }, [currentPlayer, gameMode, winner, gameOver, board])

  const checkWinner = (newBoard: Board): Player => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a]
      }
    }
    return null
  }

  const makeAiMove = () => {
    const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null) as number[]
    
    if (availableMoves.length === 0) return

    // Basit AI stratejisi
    let bestMove = availableMoves[0]

    // 1. Kazanabilir mi kontrol et
    for (const move of availableMoves) {
      const testBoard = [...board]
      const testPlayerMoves = {...playerMoves}
      testPlayerMoves.O = [...playerMoves.O, move]
      
      if (testPlayerMoves.O.length > 3) {
        const oldestMove = testPlayerMoves.O.shift()!
        testBoard[oldestMove] = null
      }
      
      testBoard[move] = 'O'
      
      if (checkWinner(testBoard) === 'O') {
        bestMove = move
        break
      }
    }

    // 2. Rakibi engelleyebilir mi kontrol et
    if (bestMove === availableMoves[0]) {
      for (const move of availableMoves) {
        const testBoard = [...board]
        const testPlayerMoves = {...playerMoves}
        testPlayerMoves.X = [...playerMoves.X, move]
        
        if (testPlayerMoves.X.length > 3) {
          const oldestMove = testPlayerMoves.X.shift()!
          testBoard[oldestMove] = null
        }
        
        testBoard[move] = 'X'
        
        if (checkWinner(testBoard) === 'X') {
          bestMove = move
          break
        }
      }
    }

    // 3. Merkez tercih et
    if (bestMove === availableMoves[0] && availableMoves.includes(4)) {
      bestMove = 4
    }

    // 4. Köşeleri tercih et
    if (bestMove === availableMoves[0]) {
      const corners = [0, 2, 6, 8].filter(corner => availableMoves.includes(corner))
      if (corners.length > 0) {
        bestMove = corners[Math.floor(Math.random() * corners.length)]
      }
    }

    // Hamleyi yap
    handleMove(bestMove, 'O')
  }

  const handleClick = (index: number) => {
    if (board[index] || winner || gameOver || isAiTurn) return
    if (gameMode === 'ai' && currentPlayer === 'O') return // AI sırası

    handleMove(index, currentPlayer)
  }

  const handleMove = (index: number, player: 'X' | 'O') => {
    const newBoard = [...board]
    const newPlayerMoves = {...playerMoves}
    
    // Mevcut oyuncunun hamle listesini güncelle
    newPlayerMoves[player] = [...playerMoves[player], index]
    
    // Eğer oyuncunun 3'ten fazla hamlesi varsa, en eskisini kaldır
    if (newPlayerMoves[player].length > 3) {
      const oldestMove = newPlayerMoves[player].shift()!
      newBoard[oldestMove] = null
    }
    
    // Yeni hamleyi ekle
    newBoard[index] = player
    
    setBoard(newBoard)
    setPlayerMoves(newPlayerMoves)

    const gameWinner = checkWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      setGameOver(true)
    } else {
      setCurrentPlayer(player === 'X' ? 'O' : 'X')
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer('X')
    setWinner(null)
    setGameOver(false)
    setPlayerMoves({X: [], O: []})
    setShowModal(false)
    setIsAiTurn(false)
  }

  const switchGameMode = (mode: GameMode) => {
    setGameMode(mode)
    resetGame()
  }

  const getStatusMessage = () => {
    if (winner) {
      if (gameMode === 'ai') {
        return winner === 'X' ? '🎉 Sen Kazandın!' : '🤖 Bilgisayar Kazandı!'
      }
      return `🎉 ${winner} Kazandı!`
    }
    if (gameOver) return '🤝 Berabere!'
    
    if (gameMode === 'ai') {
      if (isAiTurn) return '🤖 Bilgisayar düşünüyor...'
      return currentPlayer === 'X' ? 'Senin sıran' : 'Bilgisayar sırası'
    }
    
    return `Sıra: ${currentPlayer}`
  }

  const renderSymbol = (cell: Player, index: number) => {
    // Kaybolacak taşı belirle (en eski taş)
    const isOldestX = cell === 'X' && playerMoves.X.length === 3 && playerMoves.X[0] === index
    const isOldestO = cell === 'O' && playerMoves.O.length === 3 && playerMoves.O[0] === index
    const shouldFade = isOldestX || isOldestO
    
    if (cell === 'X') {
      return (
        <div className={`relative w-full h-full flex items-center justify-center transition-opacity duration-300 ${shouldFade ? 'opacity-30' : 'opacity-100'}`}>
          <div className="absolute inset-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="xGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="50%" stopColor="#ff8e8e" />
                  <stop offset="100%" stopColor="#ff4757" />
                </linearGradient>
                <filter id="xShadow">
                  <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
                </filter>
              </defs>
              <path
                d="M20,20 L80,80 M80,20 L20,80"
                stroke="url(#xGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                filter="url(#xShadow)"
              />
            </svg>
          </div>
        </div>
      )
    }
    
    if (cell === 'O') {
      return (
        <div className={`relative w-full h-full flex items-center justify-center transition-opacity duration-300 ${shouldFade ? 'opacity-30' : 'opacity-100'}`}>
          <div className="absolute inset-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="oGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ecdc4" />
                  <stop offset="50%" stopColor="#6bcf7f" />
                  <stop offset="100%" stopColor="#45b7aa" />
                </linearGradient>
                <filter id="oShadow">
                  <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
                </filter>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="url(#oGradient)"
                strokeWidth="8"
                filter="url(#oShadow)"
              />
            </svg>
          </div>
        </div>
      )
    }
    
    return null
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Oyun Modu Seçimi */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => switchGameMode('pvp')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            gameMode === 'pvp'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'bg-white/20 text-white/80 hover:bg-white/30'
          }`}
        >
          👥 2 Oyuncu
        </button>
        <button
          onClick={() => switchGameMode('ai')}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            gameMode === 'ai'
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
              : 'bg-white/20 text-white/80 hover:bg-white/30'
          }`}
        >
          🤖 Bilgisayar
        </button>
      </div>

      <div className="text-2xl font-bold text-white">
        {getStatusMessage()}
      </div>
      
      <div className="grid grid-cols-3 gap-3 bg-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-2xl">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`w-24 h-24 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed shadow-lg border border-white/20 hover:border-white/40 ${
              isAiTurn ? 'opacity-50' : ''
            }`}
            disabled={!!cell || gameOver || isAiTurn}
          >
            {renderSymbol(cell, index)}
          </button>
        ))}
      </div>



      <button
        onClick={resetGame}
        className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
      >
        🎮 Yeni Oyun
      </button>

      {/* Kazanma Modal'ı */}
      {showModal && winner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 rounded-3xl shadow-2xl transform animate-bounce">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">
                {gameMode === 'ai' && winner === 'O' ? '🤖' : '🎉'}
              </div>
              <h2 className="text-4xl font-bold mb-2">
                {gameMode === 'ai' ? 
                  (winner === 'X' ? 'TEBRİKLER!' : 'KAYBETTIN!') : 
                  'TEBRİKLER!'
                }
              </h2>
              <div className="text-2xl font-semibold mb-4">
                {gameMode === 'ai' ? (
                  winner === 'X' ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <path
                            d="M20,20 L80,80 M80,20 L20,80"
                            stroke="white"
                            strokeWidth="12"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <span>SEN KAZANDIN!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>🤖</span>
                      <span>BİLGİSAYAR KAZANDI!</span>
                    </div>
                  )
                ) : (
                  winner === 'X' ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <path
                            d="M20,20 L80,80 M80,20 L20,80"
                            stroke="white"
                            strokeWidth="12"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <span>KAZANDI!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-8 h-8">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle
                            cx="50"
                            cy="50"
                            r="30"
                            fill="none"
                            stroke="white"
                            strokeWidth="12"
                          />
                        </svg>
                      </div>
                      <span>KAZANDI!</span>
                    </div>
                  )
                )}
              </div>
              <div className="text-sm opacity-80">3 saniye sonra kapanacak...</div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default TicTacToe 