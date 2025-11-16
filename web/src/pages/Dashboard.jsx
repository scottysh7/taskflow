import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth'
import { tasksService, categoriesService } from '../services/tasks'
import { LogOut, CheckSquare, Plus, Filter, Search } from 'lucide-react'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import EmptyState from '../components/EmptyState'

export default function Dashboard() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filter, setFilter] = useState('all') // all, active, completed
  const [searchQuery, setSearchQuery] = useState('')

  // Charger les données au montage
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [tasksData, categoriesData] = await Promise.all([
        tasksService.getTasks(),
        categoriesService.getCategories()
      ])
      setTasks(tasksData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Erreur chargement:', error)
      alert('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await authService.signOut()
    navigate('/login')
  }

  const handleCreateTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleSaveTask = async (formData) => {
    try {
      // Récupérer l'utilisateur actuel
      const user = await authService.getCurrentUser()
      
      if (editingTask) {
        // Mise à jour
        const updated = await tasksService.updateTask(editingTask.id, formData)
        setTasks(tasks.map(t => t.id === updated.id ? updated : t))
      } else {
        // Création - AJOUTER LE USER_ID
        const taskData = {
          ...formData,
          user_id: user.id  // ← CETTE LIGNE EST IMPORTANTE
        }
        const newTask = await tasksService.createTask(taskData)
        setTasks([newTask, ...tasks])
      }
      setIsModalOpen(false)
      setEditingTask(null)
    } catch (error) {
      console.error('Erreur sauvegarde:', error)
      alert(`Erreur: ${error.message}`)  // Affiche le message d'erreur exact
    }
  }

  const handleToggleComplete = async (task) => {
    try {
      const updated = await tasksService.toggleComplete(task.id, task.is_completed)
      setTasks(tasks.map(t => t.id === updated.id ? updated : t))
    } catch (error) {
      console.error('Erreur toggle:', error)
    }
  }

  const handleDeleteTask = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return
    
    try {
      await tasksService.deleteTask(id)
      setTasks(tasks.filter(t => t.id !== id))
    } catch (error) {
      console.error('Erreur suppression:', error)
      alert('Erreur lors de la suppression')
    }
  }

  // Filtrage des tâches
  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'active') return !task.is_completed
      if (filter === 'completed') return task.is_completed
      return true
    })
    .filter(task => {
      if (!searchQuery) return true
      return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    })

  const stats = {
    total: tasks.length,
    active: tasks.filter(t => !t.is_completed).length,
    completed: tasks.filter(t => t.is_completed).length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Total</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">En cours</div>
            <div className="text-3xl font-bold text-primary-600">{stats.active}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">Terminées</div>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une tâche..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'active'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                En cours
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === 'completed'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Terminées
              </button>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreateTask}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Nouvelle tâche</span>
            </button>
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          tasks.length === 0 ? (
            <EmptyState onCreateTask={handleCreateTask} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              Aucune tâche ne correspond à votre recherche
            </div>
          )
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggleComplete}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        onSave={handleSaveTask}
        task={editingTask}
        categories={categories}
      />
    </div>
  )
}