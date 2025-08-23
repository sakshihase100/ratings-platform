import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')
  const name = localStorage.getItem('name')

  function logout() {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div style={{display:'flex', gap:12, padding:12, borderBottom:'1px solid #eee'}}>
      <b>Ratings Platform</b>
      {token && <Link to="/stores">Stores</Link>}
      {role === 'ADMIN' && <Link to="/admin">Admin</Link>}
      {role === 'OWNER' && <Link to="/owner">Owner</Link>}
      <div style={{marginLeft:'auto'}}>
        {!token ? <>
          <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
        </> : <>
          <span style={{marginRight:12}}>Hi, {name?.slice(0,20) || 'User'}</span>
          <button onClick={logout}>Logout</button>
        </>}
      </div>
    </div>
  )
}
