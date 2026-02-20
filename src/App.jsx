import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Studies from './pages/Studies'
import StudyDetail from './pages/StudyDetail'
import Respondents from './pages/Respondents'

function NavLink({ to, children }) {
  const location = useLocation()
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-indigo-100 text-indigo-700 font-medium'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </Link>
  )
}

export default function App() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RP</span>
              </div>
              <span className="font-semibold text-gray-900">Research Participant Manager</span>
            </div>
            <nav className="flex items-center gap-2">
              <NavLink to="/">Dashboard</NavLink>
              <NavLink to="/studies">Studies</NavLink>
              <NavLink to="/respondents">Respondents</NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/studies" element={<Studies />} />
          <Route path="/studies/:id" element={<StudyDetail />} />
          <Route path="/respondents" element={<Respondents />} />
        </Routes>
      </main>
    </div>
  )
}
