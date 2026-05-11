import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import sanityClient from '../misc/sanityClient'

export default function Home() {
  const [bachelorDegrees, setBachelorDegrees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBachelorDegrees = async () => {
      try {
        const query = `*[_type == "bachelordegree"] {
          _id,
          bachelorname,
          bachelorcode,
          "responsibleName": bachelorresponsible->firstname + " " + bachelorresponsible->lastname
        }`
        const data = await sanityClient.fetch(query)
        setBachelorDegrees(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchBachelorDegrees()
  }, [])

  if (loading) return <div>Loading bachelor degrees...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Bachelor Degrees</h1>
      <div className="bachelor-container">
        {bachelorDegrees.map((bachelor) => (
          <article key={bachelor._id} className="bachelor-card">
            <h2>{bachelor.bachelorname}</h2>
            <p><strong>Code:</strong> {bachelor.bachelorcode}</p>
            <p><strong>Responsible:</strong> {bachelor.responsibleName}</p>
            <Link to={`/bachelor/${bachelor.bachelorcode}`}>
              <button>Show Bachelor Structure</button>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}