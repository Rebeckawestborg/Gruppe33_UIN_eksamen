import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import sanityClient from '../misc/sanityClient'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) {
      setResults([])
      return
    }
    const fetchResults = async () => {
      setLoading(true)
      const query = `*[_type == "people" && (
        firstname match $term || lastname match $term || email match $term
      )]{
        _id, firstname, lastname, email, office
      } | order(lastname, firstname)`
      const data = await sanityClient.fetch(query, { term: `*${q}*` })
      setResults(data)
      setLoading(false)
    }
    fetchResults()
  }, [q])

  return (
    <div>
      <h1>Search results for "{q}"</h1>
      {loading ? (
        <p>Searching...</p>
      ) : results.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <ul>
          {results.map(person => (
            <li key={person._id}>
              <Link to={`/staff/${person._id}`}>
                {person.firstname} {person.lastname}
              </Link>
              {' — '}{person.email}
              {person.office && ` — ${person.office}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
