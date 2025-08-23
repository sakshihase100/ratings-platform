import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('name', data.name)
      navigate('/stores')
    } catch (e) {
      setError(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={submit} style={{maxWidth:420, margin:'24px auto'}}>
      <h2>Login</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <div>
        <label>Email</label>
        <input required value={email} onChange={e=>setEmail(e.target.value)} type="email" />
      </div>
      <div>
        <label>Password</label>
        <input required value={password} onChange={e=>setPassword(e.target.value)} type="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  )
}
