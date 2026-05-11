import { Outlet, Link } from 'react-router-dom'
import Search from './Search'
import './Layout.css'

export default function Layout({ loggedInUser }) {
  return (
    <div className="layout">
      <header className="layout-header">
        <span>AC TM University</span>
        <Search />
        <p>
          Welcome{' '}
          {loggedInUser
            ? <Link to={`/staff/${loggedInUser._id}`}>{loggedInUser.firstname} {loggedInUser.lastname}</Link>
            : 'No user loaded'}
        </p>
      </header>
      <nav className="layout-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/staff">Staff</Link></li>
          <li><Link to="/students">Students</Link></li>
          <li><Link to="/students/new">Add Student</Link></li>
        </ul>
      </nav>
      <main className="layout-main">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <p>&copy; 2026 AC TM University. All rights reserved.</p>
        <p><Link to="/privacy">Privacy</Link></p>
      </footer>
    </div>
  )
}
