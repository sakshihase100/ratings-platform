import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function validPassword(pw) {
    return pw.length >= 8 && pw.length <= 16 && /[A-Z]/.test(pw) && /[^A-Za-z0-9]/.test(pw)
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (name.length < 20 || name.length > 60) return setError('Name must be 20-60 characters')
    if (address.length > 400) return setError('Address max 400 chars')
    if (!validPassword(password)) return setError('Password 8-16, include uppercase & special char')
    try {
      await api.post('/auth/register', { name, email, address, password })
      navigate('/login')
    } catch (e) {
      setError(e?.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <form onSubmit={submit} style={{maxWidth:520, margin:'24px auto'}}>
      <h2>Signup (Normal User)</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <div><label>Name (20-60)</label><input required value={name} onChange={e=>setName(e.target.value)} /></div>
      <div><label>Email</label><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
      <div><label>Address</label><textarea value={address} onChange={e=>setAddress(e.target.value)} maxLength={400} /></div>
      <div><label>Password</label><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
      <button type="submit">Create Account</button>
    </form>
  )
}
