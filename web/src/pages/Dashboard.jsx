import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { LogOut, CheckSquare } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await authService.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckSquare className="w-8 h-8 text-primary-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Bienvenue sur TaskFlow ! 🎉
          </h2>
          <p className="text-gray-600">
            Votre dashboard est prêt. On va maintenant ajouter les fonctionnalités de gestion de tâches.
          </p>
        </div>
      </main>
    </div>
  )
}