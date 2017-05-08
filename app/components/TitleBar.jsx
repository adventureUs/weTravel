import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'

export default function() {
  const auth = firebase.auth()
  let trips = ['Rome', 'Montenegro']
  function getTripName() {
    // Get the trip name for the trip set as currentTrip
    return 'Trip Name'
  }
  function getAllTrips() {
    // Get other trip names via currentUser's associated trip Ids
    return trips
  }
  function changeTrip(e) {
    // Note: change map over trips to reflect actualy trip id and names.
    console.log(e.target.id)
    // e.target.id set to currentTrip
    browserHistory.push('/dashboard')
  }
  function makeNewTrip() {
    // Make a new trip with id, and add that id to currentUser.
    // Set the new trip Id to currentTrip, trigger rerender of new Dashboard
    console.log(document.getElementById('newTripInput').value)
  }
  return (
    <nav className="nav navbar-default">
      <div className="" style={{display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'}}>

        <img className="img"
          src="favicon.ico"
          style={{color: '#18bc9c',
            padding: '6px',
            height: '60px',
            filter: 'invert(100%)'}}/>

        <div style={{display: 'flex',
          alignItems: 'center',
          padding: '5px'}}>
          <h4 className="" style={{padding: '5px'}}>
            <font color="white">{getTripName()}</font>
          </h4>
          <button style={{color: '#18bc9c',
            backgroundColor: '#ffffff',
            borderRadius: '5px',
            padding: '1px 6px'}}
            type="button"
            onClick={() =>
              document.getElementById('tripsModal').style.display='block'}
              >+</button>
          <div className="modal" id="tripsModal">
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close"
                    onClick={() =>
                      document.getElementById('tripsModal').style.display='none'}
                      >&times;
                  </button>
                  <h4 className="modal-title">Your Trips</h4>
                </div>
                <div className="modal-body">
                  {(getAllTrips().map((trip, idx) =>
                    <h4 id={`${idx}`} key={`${idx}`}
                    onClick={changeTrip}
                    style={{border: 'bottom'}}
                    ><font color='#18bc9c'>{trip}</font></h4>))}
                </div>
                <div className="modal-footer"
                  style={{display: 'flex',
                    justifyContent: 'space-around'}}>
                  <input type="text" id="newTripInput"></input>
                  <button type="button" className="btn btn-primary"
                    onClick={makeNewTrip}>
                    Add a trip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{display: 'flex',
          alignItems: 'center',
          padding: '5px'}}>
          <h4 className="" style={{padding: '5px'}}>
            <font color="white">{auth.currentUser
            ? `Welcome, ${auth.currentUser.displayName || auth.currentUser.email}!`
            : ''}</font>
          </h4>

          {auth && auth.currentUser ?
            <button className='logout'
              style={{color: '#18bc9c',
                backgroundColor: '#ffffff',
                borderRadius: '5px',
                padding: '3px 6px'}}
              onClick={() => {
                auth.signOut()
                browserHistory.push('/login')
              }}>logout
              </button>
            :
            <button className='login'
              style={{color: '#18bc9c',
                backgroundColor: '#ffffff',
                borderRadius: '5px',
                padding: '3px 6px'}}
              onClick={() => browserHistory.push('/login')}>
            login</button>
          }
        </div>

      </div>
    </nav>

  )
}

//*  */}

/*
  return (
    <nav className="navbar nav navbar-default">
      <div className="container-fluid">
      <div className="navbar-collapse row">
        <div className="well-small col-lg-4">
        <img src="favicon.ico" className="navbar-brand img img-thumbnail"/>
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
   */
