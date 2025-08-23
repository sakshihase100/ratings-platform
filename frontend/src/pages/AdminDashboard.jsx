import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [filters, setFilters] = useState({ role: '', name: '', email: '', address: '' })

  async function loadStats() {
    const { data } = await api.get('/admin/dashboard')
    setStats(data)
  }

  async function loadUsers() {
    const { data } = await api.get('/admin/users', { params: filters })
    setUsers(data.rows || [])
  }

  async function loadStores() {
    const { data } = await api.get('/admin/stores', { params: filters })
    setStores(data.rows || [])
  }

  useEffect(() => { loadStats(); loadUsers(); loadStores(); }, [])

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div style={{display:'flex', gap:12}}>
        <div>Total Users: {stats.totalUsers}</div>
        <div>Total Stores: {stats.totalStores}</div>
        <div>Total Ratings: {stats.totalRatings}</div>
      </div>

      <h3 style={{marginTop:20}}>Filters</h3>
      <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
        <input placeholder="Name" value={filters.name} onChange={e=>setFilters({...filters, name:e.target.value})} />
        <input placeholder="Email" value={filters.email} onChange={e=>setFilters({...filters, email:e.target.value})} />
        <input placeholder="Address" value={filters.address} onChange={e=>setFilters({...filters, address:e.target.value})} />
        <select value={filters.role} onChange={e=>setFilters({...filters, role:e.target.value})}>
          <option value="">Any role</option>
          <option>ADMIN</option>
          <option>USER</option>
          <option>OWNER</option>
        </select>
        <button onClick={()=>{loadUsers(); loadStores();}}>Apply</button>
      </div>

      <h3 style={{marginTop:20}}>Users</h3>
      <table border="1" cellPadding="6" style={{width:'100%'}}>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th></tr>
        </thead>
        <tbody>
          {users.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.address}</td><td>{u.role}</td></tr>)}
        </tbody>
      </table>

      <h3 style={{marginTop:20}}>Stores</h3>
      <table border="1" cellPadding="6" style={{width:'100%'}}>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Address</th><th>Rating</th></tr>
        </thead>
        <tbody>
          {stores.map(s => <tr key={s.id}><td>{s.name}</td><td>{s.email}</td><td>{s.address}</td><td>{Number(s.avgRating||0).toFixed(2)}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
