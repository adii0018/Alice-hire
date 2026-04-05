import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateSession from './pages/CreateSession'
import JoinSession from './pages/JoinSession'
import Room from './pages/Room'
import Monitor from './pages/Monitor'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create-session" element={<ProtectedRoute><CreateSession /></ProtectedRoute>} />
          <Route path="/join-session" element={<ProtectedRoute><JoinSession /></ProtectedRoute>} />
          <Route path="/room/:code" element={<ProtectedRoute><Room /></ProtectedRoute>} />
          <Route path="/monitor/:code" element={<ProtectedRoute><Monitor /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
