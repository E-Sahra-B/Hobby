'use client'

import SlidingPuzzle from '@/components/SlidingPuzzle'
import KlotskiPuzzle from '@/components/KlotskiPuzzle'
import { useState } from 'react'

export default function Home() {
  return (
    <main 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-start sm:items-center justify-center p-2 sm:p-4"
      style={{ 
        touchAction: 'pan-x pan-y pinch-zoom', 
        overscrollBehavior: 'none',
        WebkitOverflowScrolling: 'touch',
        paddingTop: '60px'
      }}
    >
      <div className="w-full max-w-sm sm:max-w-lg mx-auto">
        <GameSelector />
      </div>
    </main>
  )
}

function GameSelector() {
  const [activeGame, setActiveGame] = useState<'classic' | 'klotski'>('klotski')
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="w-full fade-in relative">
      {/* Birleşik Container */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        {/* Tab Seçici */}
        <div className="flex bg-slate-50 border-b border-slate-200">
          <button
            onClick={() => setActiveGame('classic')}
            className={`flex-1 py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
              activeGame === 'classic'
                ? 'bg-white text-slate-800 border-blue-500'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100 border-transparent'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>🔢</span>
              <span>Klasik</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveGame('klotski')}
            className={`flex-1 py-4 px-6 font-medium text-sm border-b-2 transition-colors relative ${
              activeGame === 'klotski'
                ? 'bg-white text-slate-800 border-blue-500'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100 border-transparent'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>🧩</span>
              <span>Klotski</span>
              {activeGame === 'klotski' && (
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowTooltip(!showTooltip)
                  }}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer ml-1"
                >
                  i
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Oyun Alanı */}
        <div className="p-3 sm:p-6">
          {activeGame === 'classic' && <SlidingPuzzle />}
          {activeGame === 'klotski' && <KlotskiPuzzle />}
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && activeGame === 'klotski' && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-[9999]">
          <div className="bg-white text-slate-800 text-sm rounded-2xl px-6 py-4 shadow-lg border border-slate-200 min-w-[300px] max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 rounded-full p-2">
                <span className="text-lg">🎯</span>
              </div>
              <div className="font-semibold text-lg">Oyun Hedefi</div>
            </div>
            <div className="text-center leading-relaxed text-slate-600">
              Ana parçayı <span className="text-red-600 font-bold bg-red-100 px-2 py-0.5 rounded">♔</span> hedef alanına <span className="text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded">🎯</span> getirin
            </div>
            <div className="mt-3 text-xs text-slate-500 text-center">
              Parçaları seçip ok tuşları ile hareket ettirin
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
          </div>
        </div>
      )}
    </div>
  )
}
