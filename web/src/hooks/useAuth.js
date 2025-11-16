import { useState, useEffect } from 'react'
import { authService } from '../services/auth'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si un utilisateur est connecté au chargement
    authService.getCurrentUser()
      .then(user => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))

    // Écouter les changements d'authentification
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}