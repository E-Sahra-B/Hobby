'use client'

import { useState, useEffect, useCallback } from 'react'

interface Piece {
  id: number
  x: number
  y: number
  width: number
  height: number
  type: 'main' | 'vertical' | 'horizontal' | 'small'
  color: string
}

const BOARD_WIDTH = 4
const BOARD_HEIGHT = 5
const TARGET_X = 1
const TARGET_Y = 3

export default function KlotskiPuzzle() {
  const [pieces, setPieces] = useState<Piece[]>([])
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null)
  const [isWon, setIsWon] = useState(false)
  const [moves, setMoves] = useState(0)
  const [level, setLevel] = useState(1)

  // Touch events için state
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null)
  const [touchPiece, setTouchPiece] = useState<string | null>(null)

  // Rastgele seviye oluşturucu
  const generateRandomLevel = (levelId: number): { id: number; name: string; pieces: Piece[] } => {
    const configs = [
      // LEVEL 1
      {
        pieces: [
          { id: 0, x: 0, y: 3, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 2, y: 3, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 0, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 3, x: 3, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 4, x: 0, y: 1, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 5, x: 1, y: 1, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 6, x: 2, y: 1, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 3, y: 1, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 0, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 1, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 10, x: 2, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 11, x: 3, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 12, x: 3, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 13, x: 3, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
        ]
      },
      // LEVEL 2
      {
        pieces: [
          { id: 0, x: 0, y: 2, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 0, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 2, x: 2, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 3, x: 3, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 4, x: 0, y: 1, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 5, x: 1, y: 1, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 6, x: 2, y: 1, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 3, y: 1, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 2, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 2, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 10, x: 2, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 11, x: 3, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 12, x: 3, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 13, x: 3, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
        ]
      },
      // LEVEL 3
      {
        pieces: [
          { id: 0, x: 0, y: 1, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 1, y: 3, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 2, y: 3, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 3, x: 0, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 4, x: 1, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 5, x: 2, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 6, x: 3, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 3, y: 1, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 3, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 0, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 10, x: 0, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 11, x: 3, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 12, x: 3, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
        ]
      },
      // LEVEL 4
      {
        pieces: [
          { id: 0, x: 0, y: 1, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 0, y: 3, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 1, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 3, x: 1, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 4, x: 2, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 5, x: 0, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 6, x: 1, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 2, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 3, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 2, y: 1, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 10, x: 2, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 11, x: 3, y: 1, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 12, x: 3, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
        ]
      },
      // LEVEL 5
      {
        pieces: [
          { id: 0, x: 0, y: 0, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 0, y: 2, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 1, y: 2, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 3, x: 2, y: 1, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 4, x: 2, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 5, x: 3, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 6, x: 2, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 3, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 2, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 2, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 10, x: 3, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 11, x: 3, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
        ]
      },
      // LEVEL 6
      {
        pieces: [
          { id: 0, x: 0, y: 0, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 3, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 2, y: 3, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 3, x: 3, y: 3, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 4, x: 2, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 5, x: 2, y: 1, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 6, x: 0, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 1, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 0, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 1, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 10, x: 0, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 11, x: 1, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
        ]
      },
      // LEVEL 7
      {
        pieces: [
          { id: 0, x: 1, y: 0, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 3, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 3, y: 3, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 3, x: 1, y: 3, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 4, x: 1, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 5, x: 0, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 6, x: 0, y: 1, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 0, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 1, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 2, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 10, x: 3, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
        ]
      },
      // LEVEL 8
      {
        pieces: [
          { id: 0, x: 1, y: 1, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 0, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 3, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 3, x: 3, y: 2, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 4, x: 2, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 5, x: 1, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 6, x: 2, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 0, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 1, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 2, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 10, x: 1, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
        ]
      },
      // LEVEL 9
      {
        pieces: [
          { id: 0, x: 1, y: 0, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 0, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 3, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 3, x: 3, y: 2, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 4, x: 0, y: 2, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 5, x: 1, y: 2, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 6, x: 1, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 2, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 0, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 3, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
        ]
      },
      // LEVEL 10
      {
        pieces: [
          { id: 0, x: 1, y: 1, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 0, y: 1, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 3, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 3, x: 3, y: 2, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 4, x: 1, y: 0, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 5, x: 1, y: 3, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 6, x: 0, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 0, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 0, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 3, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
        ]
      },
      // LEVEL 11
      {
        pieces: [
          { id: 0, x: 1, y: 0, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 0, y: 1, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 3, y: 1, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 3, x: 0, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 4, x: 3, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 5, x: 1, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 6, x: 2, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 0, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 3, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 1, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 10, x: 1, y: 3, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' }
        ]
      },
      // LEVEL 12
      {
        pieces: [
          { id: 0, x: 0, y: 0, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 2, y: 1, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 3, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 3, x: 0, y: 2, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 4, x: 0, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 5, x: 2, y: 3, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 6, x: 2, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 3, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 0, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 3, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
        ]
      },
      // LEVEL 13
      {
        pieces: [
          { id: 0, x: 0, y: 0, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 1, y: 3, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 2, y: 1, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 3, x: 0, y: 2, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 4, x: 2, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 5, x: 2, y: 3, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 6, x: 2, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 3, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 0, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 3, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
        ]
      },
      // LEVEL 14
      {
        pieces: [
          { id: 0, x: 1, y: 0, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 0, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 3, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 3, x: 1, y: 2, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 4, x: 0, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 5, x: 3, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 6, x: 0, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 3, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 0, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 9, x: 2, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' }
        ]
      },
      // LEVEL 15
      {
        pieces: [
          { id: 0, x: 0, y: 0, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 2, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 3, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 3, x: 0, y: 2, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 4, x: 1, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 5, x: 2, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 6, x: 3, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 1, y: 3, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 8, x: 3, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 1, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' }
        ]
      },
      // LEVEL 16
      {
        pieces: [
          { id: 0, x: 2, y: 0, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 0, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 1, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 3, x: 3, y: 2, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 4, x: 0, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 5, x: 1, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 6, x: 2, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 0, y: 3, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 8, x: 2, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 0, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' }
        ]
      },
      // LEVEL 17
      {
        pieces: [
          { id: 0, x: 0, y: 1, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 2, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 3, y: 2, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 3, x: 0, y: 0, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 4, x: 3, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 5, x: 2, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 6, x: 0, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 1, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 2, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 0, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 10, x: 3, y: 4, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' }
        ]
      },
      // LEVEL 18
      {
        pieces: [
          { id: 0, x: 2, y: 1, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 0, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 0, y: 3, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 3, x: 1, y: 0, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 4, x: 0, y: 2, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 5, x: 1, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 6, x: 3, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 1, y: 1, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 1, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 2, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
        ]
      },
      // LEVEL 19
      {
        pieces: [
          { id: 0, x: 1, y: 1, width: 2, height: 2, type: 'main', color: 'bg-gradient-to-br from-red-400 to-red-600' },
          { id: 1, x: 0, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 2, x: 3, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-gradient-to-b from-blue-400 to-blue-600' },
          { id: 3, x: 0, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 4, x: 2, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-gradient-to-r from-emerald-400 to-emerald-600' },
          { id: 5, x: 1, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 6, x: 2, y: 0, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 7, x: 0, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 8, x: 3, y: 2, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 9, x: 1, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
          { id: 10, x: 2, y: 3, width: 1, height: 1, type: 'small', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
        ]
      },
      // LEVEL 20
      {
        pieces: [
          { id: 0, x: 0, y: 1, width: 2, height: 2, type: 'main', color: 'bg-red-600' },
          { id: 1, x: 0, y: 0, width: 2, height: 1, type: 'horizontal', color: 'bg-green-400' },
          { id: 2, x: 0, y: 3, width: 2, height: 1, type: 'horizontal', color: 'bg-black' },
          { id: 3, x: 1, y: 4, width: 2, height: 1, type: 'horizontal', color: 'bg-indigo-950' },
          { id: 4, x: 3, y: 0, width: 1, height: 2, type: 'vertical', color: 'bg-zinc-400' },
          { id: 5, x: 2, y: 1, width: 1, height: 2, type: 'vertical', color: 'bg-yellow-300' },
          { id: 6, x: 3, y: 3, width: 1, height: 2, type: 'vertical', color: 'bg-purple-600' },
          { id: 7, x: 3, y: 2, width: 1, height: 1, type: 'small', color: 'bg-pink-400' },
          { id: 8, x: 0, y: 4, width: 1, height: 1, type: 'small', color: 'bg-orange-300' },
        ]
      }
    ]

    return {
      id: levelId,
      name: `Seviye ${levelId}`,
      pieces: configs[(levelId - 1) % configs.length].pieces as Piece[]
    }
  }

  // Toplam seviye sayısı
  const totalLevels = 20



  // Boş alanları bul
  const getEmptySpaces = (): boolean[][] => {
    const board: boolean[][] = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(false))

    pieces.forEach(piece => {
      for (let y = piece.y; y < piece.y + piece.height; y++) {
        for (let x = piece.x; x < piece.x + piece.width; x++) {
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            board[y][x] = true
          }
        }
      }
    })

    return board
  }

  // Hareket edebilir mi kontrol et
  const canMovePiece = (piece: Piece, newX: number, newY: number): boolean => {
    // Sınırlar içinde mi
    if (newX < 0 || newY < 0 || newX + piece.width > BOARD_WIDTH || newY + piece.height > BOARD_HEIGHT) {
      return false
    }

    // Diğer parçalarla çakışma var mı
    const board = getEmptySpaces()

    // Mevcut parçayı kaldır
    for (let y = piece.y; y < piece.y + piece.height; y++) {
      for (let x = piece.x; x < piece.x + piece.width; x++) {
        if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
          board[y][x] = false
        }
      }
    }

    // Yeni pozisyonda yer var mı
    for (let y = newY; y < newY + piece.height; y++) {
      for (let x = newX; x < newX + piece.width; x++) {
        if (board[y][x]) {
          return false
        }
      }
    }

    return true
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent, pieceId: string) => {
    e.preventDefault() // Scroll'u engelle
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
    setTouchPiece(pieceId)
    setSelectedPiece(pieceId)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault() // Scroll'u engelle
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault() // Sayfa yenilenmesini engelle
    if (!touchStart || !touchPiece || isWon) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y

    // Minimum swipe mesafesi
    const minSwipeDistance = 30

    if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
      const piece = pieces.find(p => p.id.toString() === touchPiece)
      if (!piece) return

      let newX = piece.x
      let newY = piece.y

      // Hangi yön daha dominant
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Yatay hareket
        if (deltaX > 0) newX = piece.x + 1 // Sağa
        else newX = piece.x - 1 // Sola
      } else {
        // Dikey hareket
        if (deltaY > 0) newY = piece.y + 1 // Aşağı
        else newY = piece.y - 1 // Yukarı
      }

      if (canMovePiece(piece, newX, newY)) {
        const newPieces = pieces.map(p =>
          p.id.toString() === touchPiece ? { ...p, x: newX, y: newY } : p
        )

        setPieces(newPieces)
        setMoves(moves + 1)

        // Kazanma kontrolü
        const mainPiece = newPieces.find(p => p.type === 'main')
        if (mainPiece && mainPiece.x === 1 && mainPiece.y === 3) {
          setIsWon(true)
        }
      }
    }

    setTouchStart(null)
    setTouchPiece(null)
  }

  // Parça seçimi
  const handlePieceClick = (pieceId: string) => {
    if (isWon) return
    setSelectedPiece(selectedPiece === pieceId ? null : pieceId)
  }



  // Sonraki/önceki seviye
  const nextLevel = () => {
    if (level < totalLevels) {
      setLevel(level + 1)
    }
  }

  const prevLevel = () => {
    if (level > 1) {
      setLevel(level - 1)
    }
  }

  // Hareket ettir - useCallback ile sarmaladık
  const movePieceCallback = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (selectedPiece === null || isWon) return

    const piece = pieces.find(p => p.id.toString() === selectedPiece)
    if (!piece) return

    let newX = piece.x
    let newY = piece.y

    switch (direction) {
      case 'up':
        newY = piece.y - 1
        break
      case 'down':
        newY = piece.y + 1
        break
      case 'left':
        newX = piece.x - 1
        break
      case 'right':
        newX = piece.x + 1
        break
    }

    if (canMovePiece(piece, newX, newY)) {
      const newPieces = pieces.map(p =>
        p.id.toString() === selectedPiece ? { ...p, x: newX, y: newY } : p
      )

      setPieces(newPieces)
      setMoves(moves + 1)

      // Kazanma kontrolü
      const mainPiece = newPieces.find(p => p.type === 'main')
      if (mainPiece && mainPiece.x === TARGET_X && mainPiece.y === TARGET_Y) {
        setIsWon(true)
        setSelectedPiece(null)
      }
    }
  }, [selectedPiece, isWon, pieces, moves])

  // Klavye kontrolü
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          movePieceCallback('up')
          break
        case 'ArrowDown':
          e.preventDefault()
          movePieceCallback('down')
          break
        case 'ArrowLeft':
          e.preventDefault()
          movePieceCallback('left')
          break
        case 'ArrowRight':
          e.preventDefault()
          movePieceCallback('right')
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [movePieceCallback])

  // Oyunu başlat - useCallback ile sarmaladık
  const initializeGameCallback = useCallback(() => {
    const currentLevel = generateRandomLevel(level)
    setPieces(currentLevel.pieces)
    setSelectedPiece(null)
    setIsWon(false)
    setMoves(0)
  }, [level])

  useEffect(() => {
    initializeGameCallback()
  }, [initializeGameCallback])

  // Grid render
  const renderGrid = () => {
    const grid = []
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const isTarget = x === TARGET_X && y === TARGET_Y
        const isTargetArea = (x === TARGET_X || x === TARGET_X + 1) && (y === TARGET_Y || y === TARGET_Y + 1)

        grid.push(
          <div
            key={`${x}-${y}`}
            className={`
              flex items-center justify-center text-lg
              ${isTargetArea ? 'bg-gradient-to-br from-green-100 to-green-200 pulse-soft' : 'bg-slate-50/50'}
            `}
          >
            {isTarget && <span className="text-green-600">🎯</span>}
          </div>
        )
      }
    }
    return grid
  }

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
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-2 sm:mb-4">
        {/* Sol: Hamle Sayısı */}
        <div className="flex justify-start">
          <div className="bg-gradient-to-br from-purple-100 to-violet-200 rounded-2xl sm:rounded-3xl px-2 sm:px-4 py-1 sm:py-2 shadow-sm border-2 border-purple-200 w-24 sm:w-32 h-8 sm:h-10">
            <div className="h-full flex items-center justify-center gap-1 sm:gap-2">
              <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">{moves}</div>
              <div className="text-xs sm:text-sm text-purple-600 font-semibold">Hamle</div>
            </div>
          </div>
        </div>

        {/* Orta: Seviye Kontrolü */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Önceki Seviye */}
          <button
            onClick={prevLevel}
            disabled={level === 1}
            className={`w-8 sm:w-12 h-8 sm:h-10 rounded-2xl sm:rounded-3xl shadow-sm border-2 flex items-center justify-center font-bold text-sm sm:text-lg transition-all ${level === 1
              ? 'bg-slate-50 border-slate-200 cursor-not-allowed'
              : 'bg-gradient-to-br from-purple-100 to-violet-200 border-purple-200 hover:from-purple-200 hover:to-violet-300 hover:border-purple-300 hover:scale-105'
              }`}
          >
            <span className="text-purple-700">←</span>
          </button>

          {/* Seviye Göstergesi */}
          <div className="flex-1 bg-gradient-to-br from-purple-100 to-violet-200 rounded-2xl sm:rounded-3xl px-2 sm:px-4 py-1 sm:py-2 shadow-sm border-2 border-purple-200 h-8 sm:h-10">
            <div className="h-full flex items-center justify-center gap-1 sm:gap-2 px-1">
              <div className="text-sm sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Seviye</div>
              <div className="text-sm sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">{level}</div>
            </div>
          </div>

          {/* Sonraki Seviye */}
          <button
            onClick={nextLevel}
            disabled={level === totalLevels}
            className={`w-8 sm:w-12 h-8 sm:h-10 rounded-2xl sm:rounded-3xl shadow-sm border-2 flex items-center justify-center font-bold text-sm sm:text-lg transition-all ${level === totalLevels
              ? 'bg-slate-50 border-slate-200 cursor-not-allowed'
              : 'bg-gradient-to-br from-purple-100 to-violet-200 border-purple-200 hover:from-purple-200 hover:to-violet-300 hover:border-purple-300 hover:scale-105'
              }`}
          >
            <span className="text-purple-700">→</span>
          </button>
        </div>

        {/* Sağ: Yenile Butonu */}
        <div className="flex justify-end">
          <div className="bg-gradient-to-br from-purple-100 to-violet-200 hover:from-purple-200 hover:to-violet-300 rounded-2xl sm:rounded-3xl shadow-sm border-2 border-purple-200 hover:border-purple-300 transition-all hover:scale-105 w-24 sm:w-32 h-8 sm:h-10">
            <button
              onClick={initializeGameCallback}
              className="w-full h-full text-purple-700 flex items-center justify-center gap-1 sm:gap-2 py-1"
            >
              <span className="text-sm sm:text-lg">🔄</span>
              <span className="text-xs sm:text-sm font-semibold text-purple-700">Yenile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Oyun Tahtası */}
      <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 p-3 sm:p-6 rounded-2xl mb-3 sm:mb-6 mx-auto shadow-soft w-full max-w-sm sm:max-w-none" style={{ aspectRatio: '4/5', touchAction: 'none' }}>
        {/* Grid */}
        <div className="absolute inset-3 sm:inset-6 grid grid-cols-4 gap-1 rounded-xl overflow-hidden">
          {renderGrid()}
        </div>

        {/* Parçalar */}
        {pieces.map((piece) => (
          <div
            key={piece.id.toString()}
            onClick={() => handlePieceClick(piece.id.toString())}
            onTouchStart={(e) => handleTouchStart(e, piece.id.toString())}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`
                absolute cursor-pointer transition-all duration-300 rounded-xl border-2 flex items-center justify-center font-bold text-white shadow-piece piece-hover
                ${piece.color}
                ${selectedPiece === piece.id.toString() ? 'border-white/80 shadow-lg ring-2 ring-white/30' : 'border-white/20'}
              `}
            style={{
              left: `calc(0.75rem + ${piece.x} * (100% - 1.5rem) / 4)`,
              top: `calc(0.75rem + ${piece.y} * (100% - 1.5rem) / 5)`,
              width: `calc(${piece.width} * (100% - 1.5rem) / 4 - 0.25rem)`,
              height: `calc(${piece.height} * (100% - 1.5rem) / 5 - 0.25rem)`
            }}
          >
            <span className="text-xl sm:text-2xl drop-shadow-sm">
              {piece.type === 'main' && '♔'}
              {piece.type === 'vertical' && '▌'}
              {piece.type === 'horizontal' && '▬'}
              {piece.type === 'small' && '●'}
            </span>
          </div>
        ))}
      </div>

      {/* Seçili Parça Bilgisi */}
      {selectedPiece !== null && !isWon && (
        <div className="text-center mb-3 sm:mb-6 text-sm text-slate-600 bg-slate-50/50 rounded-xl py-2 sm:py-3 px-4">
          <div className="font-medium mb-1">
            {pieces.find(p => p.id.toString() === selectedPiece)?.type === 'main' ? 'Ana Parça ♔' : 'Parça'} seçili
          </div>
          <div className="text-xs text-slate-500">
            Klavye ok tuşları (↑↓←→) ile hareket ettirin
          </div>
        </div>
      )}

      {/* Kazanma Mesajı */}
      {isWon && (
        <div className="text-center fade-in bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
          <div className="text-2xl font-light text-green-700 mb-2">
            ✨ Harika!
          </div>
          <div className="text-green-600 text-sm mb-4">
            Seviye {level} • {moves} hamle
          </div>
          {level < totalLevels && (
            <button
              onClick={nextLevel}
              className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-200 btn-modern shadow-piece font-medium"
            >
              Sonraki Seviye →
            </button>
          )}
        </div>
      )}
    </div>
  )
} 