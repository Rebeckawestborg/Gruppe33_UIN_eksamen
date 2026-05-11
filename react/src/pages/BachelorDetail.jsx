import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import sanityClient from '../misc/sanityClient'
import './BachelorDetail.css'

export default function BachelorDetail() {
  const { slug } = useParams()
  const [bachelor, setBachelor] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBachelorDetail = async () => {
      try {
        const query = `*[_type == "bachelordegree" && bachelorcode == $code][0] {
          _id,
          bachelorname,
          bachelorcode,
          "responsibleName": bachelorresponsible->firstname + " " + bachelorresponsible->lastname,
          courses[] {
            _key,
            year,
            semester,
            "courseName": course->coursename,
            "courseCode": course->coursecode
          }
        }`
        const data = await sanityClient.fetch(query, { code: slug })
        setBachelor(data)
        
        // Fetch students for this bachelor degree
        if (data && data._id) {
          const studentQuery = `*[_type == "student" && bachelorprogram._ref == $bachelorId] | order(lastname) {
            _id,
            firstname,
            lastname,
            email
          }`
          const studentData = await sanityClient.fetch(studentQuery, { bachelorId: data._id })
          setStudents(studentData)
        }
        
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchBachelorDetail()
  }, [slug])

  if (loading) return <div>Loading bachelor degree details...</div>
  if (error) return <div>Error: {error}</div>
  if (!bachelor) return <div>Bachelor degree not found</div>

  return (
    <div>
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="separator">/</span>
        <span className="current">{bachelor.bachelorname}</span>
      </nav>
      
      <h1>{bachelor.bachelorname}</h1>
      <p><strong>Code:</strong> {bachelor.bachelorcode}</p>
      <p><strong>Responsible:</strong> {bachelor.responsibleName}</p>

      <h2>Course Structure</h2>
      {[1, 2, 3].map((year) => (
        <div key={year}>
          <h3>Year {year}</h3>
          <table>
            <thead>
              <tr>
                <th>Semester</th>
                <th>Course 1</th>
                <th>Course 2</th>
                <th>Course 3</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2].map((semester) => {
                const semesterCourses = bachelor.courses?.filter(
                  (course) => course.year === year && course.semester === semester
                ) || []
                return (
                  <tr key={semester}>
                    <td>{semester}</td>
                    <td>{semesterCourses[0]?.courseName} ({semesterCourses[0]?.courseCode})</td>
                    <td>{semesterCourses[1]?.courseName} ({semesterCourses[1]?.courseCode})</td>
                    <td>{semesterCourses[2]?.courseName} ({semesterCourses[2]?.courseCode})</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ))}

      <h3>Students</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.lastname}, {student.firstname}</td>
              <td>{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
