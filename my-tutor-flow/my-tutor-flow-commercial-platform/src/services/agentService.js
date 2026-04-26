/**
 * Agent Service
 * Calls the My Tutor Flow Python AI backend (FastAPI + Claude pipeline).
 * The backend runs draft → review → revise loops and returns polished output.
 */

const AGENT_API = import.meta.env.VITE_AGENT_API_URL || 'http://localhost:8000';

/**
 * Generate AI-written progress report comments for a student.
 *
 * @param {Object} params
 * @param {string} params.name - Student name
 * @param {string} params.grade - e.g. "Grade 8"
 * @param {string} params.school - School name
 * @param {string} params.term - e.g. "2nd Term"
 * @param {Array}  params.subjects - [{ name, marks: { markType: value }, average }]
 *
 * @returns {Promise<{ comments: string, iterations: number, approved: boolean }>}
 */
export async function generateProgressComments({ name, grade, school, term, subjects }) {
  const response = await fetch(`${AGENT_API}/api/generate-progress-comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, grade, school, term, subjects }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `Agent API error: ${response.status}`);
  }

  return response.json();
}
