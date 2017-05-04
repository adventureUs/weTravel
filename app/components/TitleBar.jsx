import React from 'react'
import {Link} from 'react-router'
import firebase from 'APP/fire'

const auth = firebase.auth()

export default class extends React.Component {
  render() {
    return (
    <div>
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <img className="navbar-brand" href="../public/favicon.ico" />
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className="dropdown">
                <a href="#"
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                    role="button"
                    aria-expanded="false">The Artic
                  <span className="caret"></span>
                </a>
                <ul className="dropdown-menu" role="menu">
                  <li><a href="#">San Francisco</a></li>
                  <li><a href="#">Hawaii</a></li>
                  <li><a href="#">Rome</a></li>
                </ul>
              </li>
            </ul>
           <div className="nav navbar-nav navbar-right">
             <h4>{auth.currentUser
               ? `${auth.currentUser.email}`
               : 'No one'} is signed in</h4>

             <Link to="/login">
               <button className='logout'
                       onClick={() => auth.signOut()}>logout
               </button>
             </Link>
           </div>
          </div>
        </div>
      </nav>
    </div>
  )
  }
}
