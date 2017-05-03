import React, { Component } from 'react'
import { Link } from 'react-router'

const Navbar = () =>
  (<div>
     <ul>
    <Link to="/" className='navbar navbar-title'>Interpolated Title for Trip Name</Link>
    <Link to="/travel-buddies" className='navbar navbar-title'>Travel Buddies</Link>
</ul>
  </div>
  )

export default Navbar
