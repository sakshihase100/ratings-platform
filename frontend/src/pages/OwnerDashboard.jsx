import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function OwnerDashboard() {
  const [data, setData] = useState({ store:null, raters:[], average:0 })
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/owner/dashboard').then(({data}) => setData(data)).catch(()=> setError('Failed to load'))
  }, [])

  if (error) return <div style={{color:'red'}}>{error}</div>
  if (!data.store) return <div>Loading...</div>
  return (
    <div>
      <h2>Owner Dashboard</h2>
      <div><b>Store:</b> {data.store.name} — <b>Average:</b> {data.average}</div>
      <h3 style={{marginTop:12}}>Raters</h3>
      <table border="1" cellPadding="6" style={{width:'100%'}}>
        <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Score</th></tr></thead>
        <tbody>
          {data.raters.map(r => <tr key={r.id}><td>{r.User?.name}</td><td>{r.User?.email}</td><td>{r.User?.address}</td><td>{r.score}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}
