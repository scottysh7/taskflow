import { Check, Trash2, Edit, Calendar, Tag } from 'lucide-react'

export default function TaskCard({ task, onToggle, onDelete, onEdit }) {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  }

  const priorityLabels = {
    low: 'Faible',
    medium: 'Moyenne',
    high: 'Haute'
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 p-4 hover:shadow-md transition ${
      task.is_completed ? 'border-gray-200 opacity-60' : 'border-gray-200'
    }`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task)}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${
            task.is_completed
              ? 'bg-primary-600 border-primary-600'
              : 'border-gray-300 hover:border-primary-500'
          }`}
        >
          {task.is_completed && <Check className="w-4 h-4 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium text-gray-900 ${
            task.is_completed ? 'line-through text-gray-500' : ''
          }`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {/* Priority */}
            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
              {priorityLabels[task.priority]}
            </span>

            {/* Category */}
            {task.category && (
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <Tag className="w-3 h-3" />
                {task.category.name}
              </span>
            )}

            {/* Due date */}
            {task.due_date && (
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                {new Date(task.due_date).toLocaleDateString('fr-FR')}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}