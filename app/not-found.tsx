import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-7xl mb-6">🔧</div>
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-3">404</h1>
        <p className="text-xl text-[#6B6B6B] mb-8">Siden blev ikke fundet</p>
        <Link
          href="/"
          className="bg-[#003DA5] hover:bg-[#002880] text-white font-semibold px-6 py-3 rounded-lg transition-colors inline-block"
        >
          Tilbage til forsiden
        </Link>
      </div>
    </div>
  )
}
