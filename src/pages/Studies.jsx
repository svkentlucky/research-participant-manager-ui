import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchStudies } from '../api'

const statusColors = {
  draft: 'bg-yellow-100 text-yellow-700',
  recruiting: 'bg-green-100 text-green-700',
  in_field: 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-700',
}

const methodologyLabels = {
  focus_group: 'Focus Group',
  idi: 'IDI',
  survey: 'Survey',
  ethnography: 'Ethnography',
}

export default function Studies() {
  const [studies, setStudies] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    async function loadStudies() {
      try {
        const params = filter ? { status: filter } : {}
        const data = await fetchStudies(params)
        setStudies(data.items)
      } finally {
        setLoading(false)
      }
    }
    loadStudies()
  }, [filter])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Studies</h1>
          <p className="text-gray-500 mt-1">Manage your research studies</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['', 'draft', 'recruiting', 'in_field', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {status === '' ? 'All' : status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Studies Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studies.map(study => (
            <Link
              key={study.id}
              to={`/studies/${study.id}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[study.status]}`}>
                  {study.status.replace('_', ' ')}
                </span>
                <span className="text-sm text-gray-500">{methodologyLabels[study.methodology]}</span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{study.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{study.client_name}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <div className="text-sm text-gray-500">Target</div>
                  <div className="font-semibold text-gray-900">{study.target_count} participants</div>
                </div>
                {study.incentive_amount && (
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Incentive</div>
                    <div className="font-semibold text-green-600">${study.incentive_amount}</div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
