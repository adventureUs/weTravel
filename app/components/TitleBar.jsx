import React from 'react'
import {Link} from 'react-router'
import firebase from 'APP/fire'

export default class extends React.Component {
  componentWillMount() {
    this.auth = firebase.auth()
  }
  render() {
    return (
      <nav className="navbar nav navbar-default">
        <div className="container-fluid">
        <div className="navbar-collapse row">
          <div className="well-small col-lg-2">
          <img src="favicon.ico" className="navbar-brand img img-thumbnail"/>
          </div>

        <div className="col col-lg-2">
        <select>
          <option>Hawaii</option>
          <option>Rome</option>
        </select>
        </div>

        <div className="col col-lg-2">
        <h4 className="nav navbar navbar-nav"><font color="white"><span>{this.auth.currentUser
          ? `${this.auth.currentUser.email}`
          : 'No one'}</span> is signed in</font></h4>
        </div>

        <div className="col col-lg-2">
        <Link to="/login" className="nav navbar-nav" >
          <button className='logout'
                  onClick={() => this.auth.signOut()}>logout
          </button>
        </Link>
        </div>
        </div>

        </div>
      </nav>
    )
  }
}

//*  */}

/*
<nav className="navbar navbar-default">
  <div className="collapse navbar-collapse" id="titleNav">

    <img className="navbar-brand" src="../../public/favicon.ico" />





     <Link to="/login" className="nav navbar-nav" >
       <button className='logout'
               onClick={() => this.auth.signOut()}>logout
       </button>
     </Link>

  </div>
</nav>
   */
