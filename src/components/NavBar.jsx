import React from 'react'
import { Link } from 'react-router-dom'
import '../assets/Navbar.css' // Corrected the import path

export const NavBar = () => {
  return (
    <div className='Navbar'> {/* Ensure this matches the CSS class */}
        <nav className="navbar navbar-expand-lg localnav">
                <Link className="navbar-brand Link" to="/">Navbar</Link>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item localli">
                        <Link className="nav-link Link" to="/">Home</Link>
                    </li>
                    <div className="collapse navbar-collapse" id="navbarNavDarkDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle Link" to='/' id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false" >
                                    Sign in
                                </Link>
                                <ul className="dropdown-menu dropdown-menu-dark dropdown-link" aria-labelledby="navbarDarkDropdownMenuLink">
                                    <li><Link to="/login" className="dropdown-item Link-drop">Login</Link></li>
                                    <li><Link to="/signup" className="dropdown-item Link-drop">Sign Up</Link></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </ul>
            </div>
        </nav>
    </div>
  )
}
