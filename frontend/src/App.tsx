import React from "react"
import AuthRouter from "./routers/AuthRouter"
import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    <AuthProvider>
      <AuthRouter />
    </AuthProvider>
  )
}

export default App