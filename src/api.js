const API_BASE = 'https://web-production-ca37.up.railway.app';

export async function fetchRespondents(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/respondents?${query}`);
  return res.json();
}

export async function fetchRespondent(id) {
  const res = await fetch(`${API_BASE}/api/respondents/${id}`);
  return res.json();
}

export async function createRespondent(data) {
  const res = await fetch(`${API_BASE}/api/respondents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchStudies(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/studies?${query}`);
  return res.json();
}

export async function fetchStudy(id) {
  const res = await fetch(`${API_BASE}/api/studies/${id}`);
  return res.json();
}

export async function fetchMatches(studyId, params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/api/studies/${studyId}/match?${query}`);
  return res.json();
}

export async function assignRespondents(studyId, respondentIds) {
  const res = await fetch(`${API_BASE}/api/studies/${studyId}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ respondent_ids: respondentIds }),
  });
  return res.json();
}

export async function updateAssignment(assignmentId, data) {
  const res = await fetch(`${API_BASE}/api/assignments/${assignmentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}
