import { CheckCircle2 } from 'lucide-react'

export default function EmptyState({ onCreateTask }) {
  return (
    <div className="text-center py-12">
      <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Aucune tâche pour le moment
      </h3>
      <p className="text-gray-600 mb-6">
        Commencez par créer votre première tâche
      </p>
      <button
        onClick={onCreateTask}
        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
      >
        Créer une tâche
      </button>
    </div>
  )
}