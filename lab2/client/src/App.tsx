import React, { useEffect, useState } from "react"

export default function App() {
  const [msg, setMsg] = useState("Provjeravam backend...")

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/health")
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setMsg(`Backend status: ${data.status}`)
      } catch (e) {
        setMsg(`Greška pri pozivu /api/health: ${String(e)}`)
      }
    })()
  }, [])

  return (
    <div className="container">
      <h1>XSS + Broken Access Control — React + TS</h1>
      <p>{msg}</p>
    </div>
  )
}
