'use client'

import { useState, useEffect, useCallback } from 'react'

type Tile = number | null

const GRID_SIZE = 4
const TOTAL_TILES = GRID_SIZE * GRID_SIZE

export default function SlidingPuzzle() {
  const [tiles, setTiles] = useState<Tile[]>([])
  const [isWon, setIsWon] = useState(false)
  const [moves, setMoves] = useState(0)
  
  // Touch events için state
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null)

  // Oyunu başlat
  const initializeGame = useCallback(() => {
    const initialTiles: Tile[] = []
    for (let i = 1; i < TOTAL_TILES; i++) {
      initialTiles.push(i)
    }
    initialTiles.push(null) // Boş kare
    
    // Karıştır
    const shuffled = shuffleTiles([...initialTiles])
    setTiles(shuffled)
    setIsWon(false)
    setMoves(0)
  }, [])

  // Karıştırma fonksiyonu
  const shuffleTiles = (tiles: Tile[]): Tile[] => {
    const shuffled = [...tiles]
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = shuffled.indexOf(null)
      const possibleMoves = getPossibleMoves(emptyIndex)
      if (possibleMoves.length > 0) {
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
        
        // Swap
        const temp = shuffled[emptyIndex]
        shuffled[emptyIndex] = shuffled[randomMove]
        shuffled[randomMove] = temp
      }
    }
    return shuffled
  }

  // Mümkün hamleleri bul
  const getPossibleMoves = (emptyIndex: number): number[] => {
    const row = Math.floor(emptyIndex / GRID_SIZE)
    const col = emptyIndex % GRID_SIZE
    const moves: number[] = []

    // Yukarı
    if (row > 0) moves.push((row - 1) * GRID_SIZE + col)
    // Aşağı
    if (row < GRID_SIZE - 1) moves.push((row + 1) * GRID_SIZE + col)
    // Sol
    if (col > 0) moves.push(row * GRID_SIZE + (col - 1))
    // Sağ
    if (col < GRID_SIZE - 1) moves.push(row * GRID_SIZE + (col + 1))

    return moves
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault() // Scroll'u engelle
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault() // Scroll'u engelle
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault() // Sayfa yenilenmesini engelle
    if (!touchStart || isWon) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    
    // Minimum swipe mesafesi
    const minSwipeDistance = 50
    
    if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
      const emptyIndex = tiles.indexOf(null)
      
      // Hangi yön daha dominant
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Yatay hareket
        if (deltaX > 0) {
          // Sağa kaydırma - sol taraftaki karo hareket eder
          const leftIndex = emptyIndex - 1
          if (emptyIndex % GRID_SIZE !== 0 && leftIndex >= 0) {
            moveTileToEmpty(leftIndex, emptyIndex)
          }
        } else {
          // Sola kaydırma - sağ taraftaki karo hareket eder
          const rightIndex = emptyIndex + 1
          if ((emptyIndex + 1) % GRID_SIZE !== 0 && rightIndex < TOTAL_TILES) {
            moveTileToEmpty(rightIndex, emptyIndex)
          }
        }
      } else {
        // Dikey hareket
        if (deltaY > 0) {
          // Aşağı kaydırma - üst taraftaki karo hareket eder
          const topIndex = emptyIndex - GRID_SIZE
          if (topIndex >= 0) {
            moveTileToEmpty(topIndex, emptyIndex)
          }
        } else {
          // Yukarı kaydırma - alt taraftaki karo hareket eder
          const bottomIndex = emptyIndex + GRID_SIZE
          if (bottomIndex < TOTAL_TILES) {
            moveTileToEmpty(bottomIndex, emptyIndex)
          }
        }
      }
    }

    setTouchStart(null)
  }

  const moveTileToEmpty = (tileIndex: number, emptyIndex: number) => {
    const newTiles: Tile[] = [...tiles]
    // Swap
    const temp = newTiles[emptyIndex]
    newTiles[emptyIndex] = newTiles[tileIndex]
    newTiles[tileIndex] = temp
    
    setTiles(newTiles)
    setMoves(moves + 1)
    
    // Kazanma kontrolü
    if (checkWin(newTiles)) {
      setIsWon(true)
    }
  }

  // Karo tıklama
  const handleTileClick = (index: number) => {
    if (isWon) return

    const emptyIndex = tiles.indexOf(null)
    const possibleMoves = getPossibleMoves(emptyIndex)

    if (possibleMoves.includes(index)) {
      const newTiles: Tile[] = [...tiles]
      // Swap
      const temp = newTiles[emptyIndex]
      newTiles[emptyIndex] = newTiles[index]
      newTiles[index] = temp
      
      setTiles(newTiles)
      setMoves(moves + 1)
      
      // Kazanma kontrolü
      if (checkWin(newTiles)) {
        setIsWon(true)
      }
    }
  }

  // Kazanma kontrolü
  const checkWin = (tiles: Tile[]): boolean => {
    for (let i = 0; i < TOTAL_TILES - 1; i++) {
      if (tiles[i] !== i + 1) return false
    }
    return tiles[TOTAL_TILES - 1] === null
  }

  // Oyunu başlat
  useEffect(() => {
    initializeGame()
  }, [])

  return (
    <div 
      style={{ touchAction: 'pan-x pan-y pinch-zoom', overscrollBehavior: 'none' }}
      onTouchStart={(e) => {
        // Sayfa başındaysak pull-to-refresh'i engelle
        if (window.scrollY === 0) {
          e.preventDefault()
        }
      }}
      onTouchMove={(e) => {
        // Sayfa başındaysak ve aşağı çekiyorsa engelle
        if (window.scrollY === 0) {
          e.preventDefault()
        }
      }}
    >
      {/* Modern Header */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        {/* Sol: Hamle Sayısı */}
        <div className="flex justify-start">
          <div className="bg-gradient-to-br from-purple-100 to-violet-200 rounded-2xl sm:rounded-3xl px-2 sm:px-4 py-1 sm:py-2 shadow-sm border-2 border-purple-200 w-24 sm:w-32 h-8 sm:h-10">
            <div className="h-full flex items-center justify-center gap-1 sm:gap-2">
              <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">{moves}</div>
              <div className="text-xs sm:text-sm text-purple-600 font-semibold">Hamle</div>
            </div>
          </div>
        </div>

        {/* Orta: Boş alan */}
        <div className="flex justify-center">
          <div className="text-xs sm:text-sm text-slate-600 flex items-center">
            {isWon && "🎉 Tebrikler!"}
          </div>
        </div>

        {/* Sağ: Yenile Butonu */}
        <div className="flex justify-end">
          <div className="bg-gradient-to-br from-purple-100 to-violet-200 hover:from-purple-200 hover:to-violet-300 rounded-2xl sm:rounded-3xl shadow-sm border-2 border-purple-200 hover:border-purple-300 transition-all hover:scale-105 w-24 sm:w-32 h-8 sm:h-10">
            <button
              onClick={initializeGame}
              className="w-full h-full text-purple-700 flex items-center justify-center gap-1 sm:gap-2 py-1"
            >
              <span className="text-sm sm:text-lg">🔄</span>
              <span className="text-xs sm:text-sm font-semibold">Yenile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Oyun Tahtası */}
      <div 
        className="bg-gradient-to-br from-slate-100 to-slate-200 p-4 sm:p-6 rounded-2xl mb-4 sm:mb-6 mx-auto shadow-soft w-full max-w-sm sm:max-w-none" 
        style={{ aspectRatio: '1/1', touchAction: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-4 gap-1 sm:gap-2 h-full w-full">
          {tiles.map((tile, index) => (
            <button
              key={index}
              onClick={() => handleTileClick(index)}
              disabled={tile === null}
              className={`
                aspect-square rounded-lg sm:rounded-xl font-bold text-lg sm:text-2xl transition-all duration-200 shadow-md
                ${tile === null 
                  ? 'bg-transparent cursor-default' 
                  : 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white hover:from-blue-500 hover:to-indigo-600 hover:scale-105 active:scale-95'
                }
              `}
            >
              {tile !== null && tile}
            </button>
          ))}
        </div>
      </div>

      {/* Kazanma mesajı */}
      {isWon && (
        <div className="text-center fade-in bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
          <div className="text-2xl font-light text-green-700 mb-2">
            ✨ Tebrikler!
          </div>
          <div className="text-green-600 text-sm mb-4">
            {moves} hamlede tamamladınız
          </div>
          <button
            onClick={initializeGame}
            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-200 btn-modern shadow-piece font-medium"
          >
            Yeni Oyun
          </button>
        </div>
      )}

      {/* Amaç */}
      <div className="text-center text-slate-500 text-xs mt-4">
        Karoları sıralayarak 1-15 dizilimini oluşturun
      </div>
    </div>
  )
} 