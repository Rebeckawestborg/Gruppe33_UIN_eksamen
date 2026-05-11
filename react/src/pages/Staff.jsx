import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import sanityClient from '../misc/sanityClient'
import './Staff.css'

export default function Staff({ loggedInUser }) {
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPosition, setSelectedPosition] = useState(null)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const query = `*[_type == "people"] {
          _id,
          firstname,
          lastname,
          email,
          office,
          "positions": position[]->.name,
          "courseResponsible": *[_type == "course" && courseResponsible._ref == ^._id][].coursename,
          "teacherCourses": *[_type == "course" && ^._id in teachers[]._ref][].coursename,
          "bachelorResponsible": *[_type == "bachelordegree" && bachelorresponsible._ref == ^._id][].bachelorname
        } | order(lastname, firstname)`
        const data = await sanityClient.fetch(query)
        setPeople(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchStaff()
  }, [])

  // Get unique positions from all people
  const allPositions = [...new Set(people.flatMap((person) => person.positions || []))].sort()

  // Filter people based on selected position
  const filteredPeople = selectedPosition
    ? people.filter((person) => person.positions && person.positions.includes(selectedPosition))
    : people

  if (loading) return <div>Loading staff information...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Staff</h1>
      
      <div className="staff-filters">
        <button
          className={selectedPosition === null ? 'active' : ''}
          onClick={() => setSelectedPosition(null)}
        >
          Show All
        </button>
        {allPositions.map((position) => (
          <button
            key={position}
            className={selectedPosition === position ? 'active' : ''}
            onClick={() => setSelectedPosition(position)}
          >
            {position}
          </button>
        ))}
      </div>

      <div className="staff-container">
        {filteredPeople.map((person) => (
          <article key={person._id} className="staff-card">
            <h2>
              <Link to={`/staff/${person._id}`}>
                {person.firstname} {person.lastname}
              </Link>
              {loggedInUser?._id === person._id && (
                <span style={{ marginLeft: '0.5rem', color: 'green' }}>(you)</span>
              )}
            </h2>
            <p><strong>Email:</strong> {person.email}</p>
            {person.office && <p><strong>Office:</strong> {person.office}</p>}
            {person.positions && person.positions.length > 0 && (
              <div>
                <p><strong>Position:</strong></p>
                <ul>
                  {person.positions.map((position, index) => (
                    <li key={index}>{position}</li>
                  ))}
                </ul>
              </div>
            )}
            {person.courseResponsible && person.courseResponsible.length > 0 && (
              <div>
                <p><strong>Course Responsible:</strong></p>
                <ul>
                  {person.courseResponsible.map((course, index) => (
                    <li key={index}>{course}</li>
                  ))}
                </ul>
              </div>
            )}
            {person.teacherCourses && person.teacherCourses.length > 0 && (
              <div>
                <p><strong>Teacher For:</strong></p>
                <ul>
                  {person.teacherCourses.map((course, index) => (
                    <li key={index}>{course}</li>
                  ))}
                </ul>
              </div>
            )}
            {person.bachelorResponsible && person.bachelorResponsible.length > 0 && (
              <div>
                <p><strong>Bachelor Responsible:</strong></p>
                <ul>
                  {person.bachelorResponsible.map((bachelor, index) => (
                    <li key={index}>{bachelor}</li>
                  ))}
                </ul>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
