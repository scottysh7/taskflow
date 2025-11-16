import { supabase } from './supabase'

export const authService = {
  // Inscription
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  // Connexion
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },

  // Déconnexion
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Récupérer l'utilisateur actuel
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Écouter les changements d'auth
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}