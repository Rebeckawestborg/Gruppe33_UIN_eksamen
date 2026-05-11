import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import sanityClient from '../misc/sanityClient'

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      const query = `*[_type == "student"] | order(lastname, firstname){
        _id,
        firstname,
        lastname,
        email,
        "bachelor": bachelorprogram->{ _id, bachelorname, bachelorcode }
      }`
      const data = await sanityClient.fetch(query)
      setStudents(data)
      setLoading(false)
    }
    fetchStudents()
  }, [])

  if (loading) return <div>Loading students...</div>

  return (
    <div>
      <h1>Students</h1>
      <p><Link to="/students/new">+ Add new student</Link></p>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Bachelor program</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.firstname} {student.lastname}</td>
                <td>{student.email}</td>
                <td>
                  {student.bachelor?.bachelorcode ? (
                    <Link to={`/bachelor/${student.bachelor.bachelorcode}`}>
                      {student.bachelor.bachelorname}
                    </Link>
                  ) : (
                    student.bachelor?.bachelorname || '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
