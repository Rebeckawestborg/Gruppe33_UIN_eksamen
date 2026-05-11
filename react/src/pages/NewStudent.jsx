import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import sanityClient from '../misc/sanityClient'
import './NewStudent.css'

export default function NewStudent() {
  const navigate = useNavigate()

  const [bachelors, setBachelors] = useState([])

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [bachelorId, setBachelorId] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBachelors = async () => {
      const query = `*[_type == "bachelordegree"] | order(bachelorname asc){
        _id, bachelorname, bachelorcode
      }`
      const data = await sanityClient.fetch(query)
      setBachelors(data)
    }
    fetchBachelors()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    if (!firstname.trim() || !lastname.trim() || !email.trim()) {
      setError('First name, last name, and email are required.')
      return
    }
    if (!bachelorId) {
      setError('Please select a bachelor program.')
      return
    }

    setSubmitting(true)
    try {
      await sanityClient.create({
        _type: 'student',
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        bachelorprogram: { _type: 'reference', _ref: bachelorId }
      })
      navigate('/students')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1>Add new student</h1>
      <form onSubmit={handleSubmit} className="student-form">
        <p>
          <label>
            First name:{' '}
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              disabled={submitting}
            />
          </label>
        </p>
        <p>
          <label>
            Last name:{' '}
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              disabled={submitting}
            />
          </label>
        </p>
        <p>
          <label>
            Email:{' '}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </label>
        </p>
        <p>
          <label>
            Bachelor program:{' '}
            <select
              value={bachelorId}
              onChange={(e) => setBachelorId(e.target.value)}
              disabled={submitting}
            >
              <option value="">— choose program —</option>
              {bachelors.map(b => (
                <option key={b._id} value={b._id}>
                  {b.bachelorname} ({b.bachelorcode})
                </option>
              ))}
            </select>
          </label>
        </p>

        {error && <p className="form-error">{error}</p>}

        <p>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : 'Add student'}
          </button>
        </p>
      </form>
    </div>
  )
}
