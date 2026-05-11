import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import sanityClient from '../misc/sanityClient'

export default function StaffDetail() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPerson = async () => {
      const query = `*[_type == "people" && _id == $id][0]{
        _id,
        firstname,
        lastname,
        email,
        office,
        "profileImageUrl": profileImage.asset->url,
        "positions": position[]->.name,
        "courseResponsible": *[_type == "course" && courseResponsible._ref == ^._id]{ _id, coursename },
        "teacherCourses": *[_type == "course" && ^._id in teachers[]._ref]{ _id, coursename },
        "bachelorResponsible": *[_type == "bachelordegree" && bachelorresponsible._ref == ^._id]{ _id, bachelorname }
      }`
      const data = await sanityClient.fetch(query, { id })
      setPerson(data)
      setLoading(false)
    }
    fetchPerson()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!person) return <div>Person not found.</div>

  return (
    <div>
      <p><Link to="/staff">&larr; Back to staff</Link></p>
      <h1>{person.firstname} {person.lastname}</h1>
      <img
        src={person.profileImageUrl || `https://placehold.co/200x200?text=${encodeURIComponent(`${person.firstname} ${person.lastname}`)}`}
        alt={`${person.firstname} ${person.lastname}`}
        style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: '50%' }}
      />
      <p><strong>Email:</strong> {person.email}</p>
      {person.office && <p><strong>Office:</strong> {person.office}</p>}

      {person.positions?.length > 0 && (
        <section>
          <h2>Positions</h2>
          <ul>
            {person.positions.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </section>
      )}

      {person.courseResponsible?.length > 0 && (
        <section>
          <h2>Course Responsible</h2>
          <ul>
            {person.courseResponsible.map(c => <li key={c._id}>{c.coursename}</li>)}
          </ul>
        </section>
      )}

      {person.teacherCourses?.length > 0 && (
        <section>
          <h2>Teacher For</h2>
          <ul>
            {person.teacherCourses.map(c => <li key={c._id}>{c.coursename}</li>)}
          </ul>
        </section>
      )}

      {person.bachelorResponsible?.length > 0 && (
        <section>
          <h2>Bachelor Responsible</h2>
          <ul>
            {person.bachelorResponsible.map(b => <li key={b._id}>{b.bachelorname}</li>)}
          </ul>
        </section>
      )}
    </div>
  )
}
