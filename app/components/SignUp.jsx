import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
const userRef = db.ref('users/')

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  setEmailPassword = (evt) => {
    this.setState({ [evt.target.id]: evt.target.value })
  }

  googleSubmit = (userCredential) => {
    // console.log('MADE IT TO GOOGLE SUBMIT, here is the credential', userCredential)
    const queryString = window.location.search
    queryString ? this.addToTrip(userCredential.user, queryString) : this.createNewTrip(userCredential.user)
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    // console.log('MADE IT TO ON SUBMIT')
    const queryString = window.location.search
    if (this.state.email.length && this.state.password.length) {
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
          queryString ? this.addToTrip(user, queryString) : this.createNewTrip(user)
        })
    } else {
      window.alert('Please fill in both your email and password')
    }
  }

  addToTrip = (user, queryString) => {
    // console.log('GOT INTO ADD-TO-TRIP', user)
    
    const userId = user.uid
    const tripId = queryString.slice(1)
    // this.setState({ tripId: tripId })

    // first updates trips table by adding this new user to the buddies portion of the particular trip table
    db.ref('trips/').child(tripId).child('buddies').update({
      [userId]: {
        status: { id: '1', text: 'Invited' }
      }
    })

    // In the users table, creates a new user with the querystring as the the trip
    userRef.update({
      [userId]: {
        email: user.email,
        trips: [tripId]
      }
    })
      .then(() => browserHistory.push('/dashboard/' + tripId))
      .catch(error => {
        window.alert(error)
      })
  }


  createNewTrip = (user) => {
    const userId = user.uid
    // console.log('GOT INTO CREATE-NEW-TRIP', userId)

    // first creates new trip data and key and updates trip table
    var newTripKey = db.ref('trips/').push().key
    // this.setState({ tripId: newTripKey })
    var newTripData = {
      tripName: 'Please Name Your Trip Here!',
      buddies: {
        [userId]: {
          status: { id: '2', text: 'Going' }
        }
      }
    }
    var newTrip = {}
    newTrip[newTripKey] = newTripData
    db.ref('trips/').update(newTrip)

    // then in users table, creates a new user with with new trip key
    userRef.update({
      [userId]: {
        email: user.email,
        trips: [newTripKey]
      }
    })
      // concerned about this then
      .then(() => {
        browserHistory.push('/dashboard/' + newTripKey)
      })
      .catch(error => {
        window.alert(error)
      })
  }

  render() {
    const auth = firebase.auth()
    const google = new firebase.auth.GoogleAuthProvider()
    const email = new firebase.auth.EmailAuthProvider()
    // console.log('STATE, look at tripID', this.state)
    return (
      <div className="jumbotron">
        <form onSubmit={this.onSubmit} className="form-horizontal well">
          <legend className="col-lg-12" >Create an account with your e-mail and a password</legend>
          <div className="form-group">
            <label htmlFor="inputEmail" className="col-lg-2 control-label">Email</label>
            <div className="col-lg-10">
              <input type="email" className="form-control" id="email" placeholder="Email" onChange={this.setEmailPassword} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="inputPassword" className="col-lg-2 control-label">Password</label>
            <div className="col-lg-10">
              <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.setEmailPassword} />
            </div>
          </div>
          <div className="form-group">
            <div className="col-lg-10 col-lg-offset-2">
              <button type="submit" className='btn btn-success'>Submit</button>
            </div>
          </div>
        </form>
        <div>
          <div>
            <button className='google login btn btn-primary'
              onClick={() => {
                auth.signInWithPopup(google)
                  // this is problematic, since you NEED a parametrized dashboard
                  // .then(() => {
                  //   window.location.search ?
                  //     browserHistory.push('/dashboard/' + window.location.search.slice(1))
                  //     // : browserHistory.push('/dashboard') // eventually needs to grab tripId to render dashboard properyly
                  //     : console.log("OOPS")
                  // })
                  .then((userCredential) => {
                    // console.log('THE RES', userCredential)
                    this.googleSubmit(userCredential)
                  })
              }}>Sign up with Google</button>
          </div>
          <br />
        </div>
      </div>
    )
  }
}
