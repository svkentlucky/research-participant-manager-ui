import { useState, useEffect } from 'react'
import { fetchRespondents } from '../api'

const STATES = ['', 'NY', 'CA', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA', 'WA', 'AZ', 'MA', 'CO']
const INCOMES = ['', 'Under 25k', '25k-50k', '50k-75k', '75k-100k', '100k-150k', '150k+']

export default function Respondents() {
  const [respondents, setRespondents] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    state: '',
    household_income: '',
    age_min: '',
    age_max: '',
  })
  const [page, setPage] = useState(0)
  const limit = 20

  useEffect(() => {
    async function loadRespondents() {
      setLoading(true)
      try {
        const params = { limit, offset: page * limit }
        if (filters.state) params.state = filters.state
        if (filters.household_income) params.household_income = filters.household_income
        if (filters.age_min) params.age_min = filters.age_min
        if (filters.age_max) params.age_max = filters.age_max

        const data = await fetchRespondents(params)
        setRespondents(data.items)
        setTotal(data.total)
      } finally {
        setLoading(false)
      }
    }
    loadRespondents()
  }, [filters, page])

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(0)
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Respondents</h1>
        <p className="text-gray-500 mt-1">{total} total respondents in database</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All States</option>
              {STATES.filter(s => s).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Household Income</label>
            <select
              value={filters.household_income}
              onChange={(e) => handleFilterChange('household_income', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Incomes</option>
              {INCOMES.filter(i => i).map(income => (
                <option key={income} value={income}>{income}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Age</label>
            <input
              type="number"
              value={filters.age_min}
              onChange={(e) => handleFilterChange('age_min', e.target.value)}
              placeholder="18"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Age</label>
            <input
              type="number"
              value={filters.age_max}
              onChange={(e) => handleFilterChange('age_max', e.target.value)}
              placeholder="99"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {respondents.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{r.first_name} {r.last_name}</div>
                        <div className="text-sm text-gray-500">{r.occupation}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.state}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.age}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.household_income}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {r.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {page * limit + 1} to {Math.min((page + 1) * limit, total)} of {total}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
