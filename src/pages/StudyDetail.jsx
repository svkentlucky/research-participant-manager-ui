import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchStudy, fetchMatches, assignRespondents } from '../api'

const statusColors = {
  draft: 'bg-yellow-100 text-yellow-700',
  recruiting: 'bg-green-100 text-green-700',
  in_field: 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-700',
}

const operatorLabels = {
  eq: '=',
  neq: '≠',
  gte: '≥',
  lte: '≤',
  in: 'in',
  between: 'between',
}

export default function StudyDetail() {
  const { id } = useParams()
  const [study, setStudy] = useState(null)
  const [matches, setMatches] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showMatches, setShowMatches] = useState(false)
  const [selectedRespondents, setSelectedRespondents] = useState([])
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        const studyData = await fetchStudy(id)
        setStudy(studyData)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  async function loadMatches() {
    setShowMatches(true)
    const matchData = await fetchMatches(id, { limit: 50 })
    setMatches(matchData)
  }

  async function handleAssign() {
    if (selectedRespondents.length === 0) return
    setAssigning(true)
    try {
      await assignRespondents(id, selectedRespondents)
      setSelectedRespondents([])
      // Reload data
      const [studyData, matchData] = await Promise.all([
        fetchStudy(id),
        fetchMatches(id, { limit: 50 }),
      ])
      setStudy(studyData)
      setMatches(matchData)
    } finally {
      setAssigning(false)
    }
  }

  function toggleRespondent(respondentId) {
    setSelectedRespondents(prev =>
      prev.includes(respondentId)
        ? prev.filter(id => id !== respondentId)
        : [...prev, respondentId]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!study) {
    return <div className="text-center py-12 text-gray-500">Study not found</div>
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/studies" className="text-gray-500 hover:text-gray-700">Studies</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900">{study.title}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{study.title}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[study.status]}`}>
                {study.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-gray-500">{study.client_name} • {study.methodology}</p>
          </div>
          {study.incentive_amount && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Incentive</div>
              <div className="text-xl font-bold text-green-600">${study.incentive_amount}</div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-100">
          <div>
            <div className="text-sm text-gray-500">Target</div>
            <div className="text-lg font-semibold">{study.target_count}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Invited</div>
            <div className="text-lg font-semibold">{study.assignment_counts?.invited || 0}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Confirmed</div>
            <div className="text-lg font-semibold text-green-600">{study.assignment_counts?.confirmed || 0}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Completed</div>
            <div className="text-lg font-semibold text-blue-600">{study.assignment_counts?.completed || 0}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">No Shows</div>
            <div className="text-lg font-semibold text-red-600">{study.assignment_counts?.no_show || 0}</div>
          </div>
        </div>
      </div>

      {/* Screener Criteria */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Screener Criteria</h2>
        {study.criteria && study.criteria.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {study.criteria.map((c, i) => (
              <div key={i} className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-sm">
                <span className="font-medium">{c.field_name}</span>
                <span className="mx-1 text-indigo-400">{operatorLabels[c.operator]}</span>
                <span>{Array.isArray(c.value) ? c.value.join(', ') : c.value}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No criteria defined</p>
        )}
      </div>

      {/* Find Matches Button */}
      {!showMatches && (
        <button
          onClick={loadMatches}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Find Matching Respondents
        </button>
      )}

      {/* Matches */}
      {showMatches && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Matching Respondents</h2>
              <p className="text-sm text-gray-500">{matches?.total || 0} respondents match the criteria</p>
            </div>
            {selectedRespondents.length > 0 && (
              <button
                onClick={handleAssign}
                disabled={assigning}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {assigning ? 'Assigning...' : `Assign ${selectedRespondents.length} Selected`}
              </button>
            )}
          </div>

          {matches ? (
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {matches.items.map(respondent => (
                <div
                  key={respondent.id}
                  onClick={() => toggleRespondent(respondent.id)}
                  className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors ${
                    selectedRespondents.includes(respondent.id) ? 'bg-indigo-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRespondents.includes(respondent.id)}
                    onChange={() => {}}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {respondent.first_name} {respondent.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {respondent.email}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{respondent.state}</div>
                  <div className="text-sm text-gray-500">Age {respondent.age}</div>
                  <div className="text-sm text-gray-500">{respondent.household_income}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
