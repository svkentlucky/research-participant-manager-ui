import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchStudies, fetchRespondents, fetchHealth } from '../api'

function StatCard({ title, value, subtitle, color = 'indigo' }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700',
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    orange: 'bg-orange-50 text-orange-700',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${colors[color]} mb-3`}>
        {title}
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [studies, setStudies] = useState([])
  const [apiStatus, setApiStatus] = useState('checking')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const health = await fetchHealth()
        setApiStatus(health.status === 'healthy' ? 'connected' : 'error')

        const [studiesData, respondentsData] = await Promise.all([
          fetchStudies(),
          fetchRespondents({ limit: 1 }),
        ])

        setStudies(studiesData.items.slice(0, 5))
        setStats({
          totalStudies: studiesData.total,
          totalRespondents: respondentsData.total,
          activeStudies: studiesData.items.filter(s => s.status === 'recruiting' || s.status === 'in_field').length,
          completedStudies: studiesData.items.filter(s => s.status === 'completed').length,
        })
      } catch (err) {
        setApiStatus('error')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your research operations</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
          apiStatus === 'connected'
            ? 'bg-green-50 text-green-700'
            : apiStatus === 'error'
            ? 'bg-red-50 text-red-700'
            : 'bg-gray-50 text-gray-700'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            apiStatus === 'connected' ? 'bg-green-500' : apiStatus === 'error' ? 'bg-red-500' : 'bg-gray-400'
          }`}></div>
          API {apiStatus === 'connected' ? 'Connected' : apiStatus === 'error' ? 'Error' : 'Checking...'}
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Respondents" value={stats.totalRespondents} color="indigo" />
          <StatCard title="Total Studies" value={stats.totalStudies} color="blue" />
          <StatCard title="Active Studies" value={stats.activeStudies} subtitle="Recruiting or In Field" color="green" />
          <StatCard title="Completed" value={stats.completedStudies} color="orange" />
        </div>
      )}

      {/* Recent Studies */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Studies</h2>
          <Link to="/studies" className="text-sm text-indigo-600 hover:text-indigo-700">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {studies.map(study => (
            <Link
              key={study.id}
              to={`/studies/${study.id}`}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div>
                <div className="font-medium text-gray-900">{study.title}</div>
                <div className="text-sm text-gray-500">{study.client_name} • {study.methodology}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  study.status === 'recruiting' ? 'bg-green-100 text-green-700' :
                  study.status === 'in_field' ? 'bg-blue-100 text-blue-700' :
                  study.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {study.status}
                </span>
                <span className="text-gray-400">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
