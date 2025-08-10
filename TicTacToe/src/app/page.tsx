import TicTacToe from '@/components/TicTacToe'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Tic Tac Toe</h1>
        <TicTacToe />
      </div>
    </main>
  )
}
