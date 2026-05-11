import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import sanityClient from './misc/sanityClient'
import Layout from './components/Layout'
import Home from './pages/Home'
import BachelorDetail from './pages/BachelorDetail'
import Staff from './pages/Staff'
import StaffDetail from './pages/StaffDetail'
import Students from './pages/Students'
import NewStudent from './pages/NewStudent'
import SearchResults from './pages/SearchResults'
import Show404 from './components/show404'

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const query = `*[_type == "people"][0]{ _id, firstname, lastname, email }`
        const user = await sanityClient.fetch(query)
        setLoggedInUser(user)
      } catch (error) {
        console.error('Error fetching logged in user:', error)
      }
    }
    fetchUser()
  }, [])

  return (
    <Routes>
      <Route element={<Layout loggedInUser={loggedInUser} />}>
        <Route path="/" element={<Home />} />
        <Route path="/bachelor/:slug" element={<BachelorDetail />} />
        <Route path="/staff" element={<Staff loggedInUser={loggedInUser} />} />
        <Route path="/staff/:id" element={<StaffDetail />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/new" element={<NewStudent />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="*" element={<Show404 />} />
      </Route>
    </Routes>
  )
}

export default App
