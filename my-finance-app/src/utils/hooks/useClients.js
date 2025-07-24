import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../pages/auth/AuthContext'

const API_BASE = import.meta.env.VITE_APP_BASE_URL

export function useClients() {
  const { token } = useAuth() || {}
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchClients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/clients`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const normalized = Array.isArray(json) ? json.map(normalizeClient) : []
      setData(normalized)
    } catch (err) {
      console.error('Fetch clients failed', err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [token])

  const addClient = useCallback(async (client) => {
    try {
      const res = await fetch(`${API_BASE}/api/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(client),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await res.json()
      fetchClients()
    } catch (err) {
      console.error('Add client failed', err)
      setError(err)
    }
  }, [token, fetchClients])

  const updateClient = useCallback(async (client) => {
    try {
      const clientId = client.id || client._id
      const res = await fetch(`${API_BASE}/api/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(client),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await res.json()
      fetchClients()
    } catch (err) {
      console.error('Update client failed', err)
      setError(err)
    }
  }, [token, fetchClients])

  const deleteClient = useCallback(async (clientId) => {
    try {
      const res = await fetch(`${API_BASE}/api/clients/${clientId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      fetchClients()
    } catch (err) {
      console.error('Delete client failed', err)
      setError(err)
    }
  }, [token, fetchClients])

  useEffect(() => {
    fetchClients()
  }, [fetchClients])

  return { data, loading, error, refetch: fetchClients, addClient, updateClient, deleteClient }
}

function normalizeClient(raw) {
  return {
    id: raw.id ?? raw._id ?? crypto.randomUUID(),
    name: raw.name ?? raw.fullName ?? 'Unnamed',
    status: normalizeStatus(raw.status),
    revenue: Number(raw.revenue) || 0,
    joinedDate: raw.joinedDate ?? raw.createdAt ?? null,
    ...raw,
  }
}

function normalizeStatus(s) {
  if (!s) return 'Unknown'
  const v = String(s).toLowerCase()
  if (v === 'active') return 'Active'
  if (v === 'inactive') return 'Inactive'
  if (v === 'lead' || v === 'prospect') return 'Lead'
  return s
}
