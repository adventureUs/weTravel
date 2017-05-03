import React, { Component } from 'react'
import { Link } from 'react-router'

const Navbar = () =>
  (<div>
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            <Link to="/" className="navbar-brand">Title</Link>
            <Link to="/travel_buddies" className="navbar-brand">Travel Buddies</Link>
          </ul>
        </div>
      </div>
    </nav>
    </div>
  )

export default Navbar
