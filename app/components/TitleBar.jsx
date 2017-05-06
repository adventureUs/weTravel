import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'

export default function() {
  const auth = firebase.auth()
  return (
    <nav className="navbar nav navbar-default">
      <div className="container-fluid">
      <div className="navbar-collapse row">
        <div className="well-small col-lg-4">
        <img src="/favicon.ico" className="navbar-brand img img-thumbnail"/>
        </div>

      <div className="col col-lg-4">
      <select>
        <option>Hawaii</option>
        <option>Rome</option>
      </select>
      </div>

      <div className="col col-lg-2">
      <h4 className="nav navbar navbar-nav"><font color="white"><span>{auth.currentUser
        ? `${auth.currentUser.email}`
        : 'No one'}</span> is signed in</font></h4>
      </div>

      <div className="col col-lg-2">
      {auth && auth.currentUser ?
      <Link to="/login" className="nav navbar-nav" >
        <button className='logout'
                onClick={() => auth.signOut()}>logout
        </button>
      </Link> :
          <button className='login'
                  onClick={() => browserHistory.push('/login')}>
          login</button>
      }
      </div>

      </div>

      </div>
    </nav>
    )
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
