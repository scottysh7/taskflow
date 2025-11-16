import { supabase } from './supabase'

export const tasksService = {
  // Récupérer toutes les tâches de l'utilisateur
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        category:categories(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Créer une tâche
  async createTask(task) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Mettre à jour une tâche
  async updateTask(id, updates) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Supprimer une tâche
  async deleteTask(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Basculer le statut complété
  async toggleComplete(id, isCompleted) {
    return this.updateTask(id, { is_completed: !isCompleted })
  }
}

export const categoriesService = {
  // Récupérer toutes les catégories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (error) throw error
    return data
  },

  // Créer une catégorie
  async createCategory(category) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}