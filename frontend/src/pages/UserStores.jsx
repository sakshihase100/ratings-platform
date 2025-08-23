import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function UserStores() {
  const [rows, setRows] = useState([])
  const [count, setCount] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [error, setError] = useState('')

  async function load() {
    try {
      const { data } = await api.get('/stores', { params: { search, page, pageSize } })
      setRows(data.rows || [])
      setCount(data.count || 0)
    } catch (e) {
      setError('Failed to load stores')
    }
  }
  useEffect(() => { load() }, [search, page, pageSize])

  async function rate(id, score) {
    try {
      await api.post(`/stores/${id}/rate`, { score })
      load()
    } catch (e) {
      alert('Failed to submit rating')
    }
  }

  return (
    <div>
      <h2>Stores</h2>
      <input placeholder="Search by name/address" value={search} onChange={e=>setSearch(e.target.value)} />
      {error && <div style={{color:'red'}}>{error}</div>}
      <table border="1" cellPadding="6" style={{width:'100%', marginTop:12}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>My Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.address}</td>
              <td>{Number(r.avgRating || 0).toFixed(2)}</td>
              <td>{r.myRating || 0}</td>
              <td>
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={()=>rate(r.id, s)} disabled={r.myRating===s}>{s}★</button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop:12}}>
        <button onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
        <span style={{margin:'0 8px'}}>Page {page}</span>
        <button onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </div>
  )
}
