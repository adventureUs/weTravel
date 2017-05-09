import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
const userRef = db.ref('users/')

export default class extends React.Component {
  constructor(props) {
    super(props)
    // no props currently
    this.state = {
      email: '',
      password: '',
    }
  }

  setEmailPassword = (evt) => {
    this.setState({ [evt.target.id]: evt.target.value })
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    // what we actually want to do is redirect to the dashboard view

    if (this.state.email.length && this.state.password.length) {
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        // 'redcuer' logic
        // This then creates a new user in the db
        .then((user) => {
          const userId = user.uid
          var newTripData = {
            name: 'Please Name Your Trip Here!',
            buddies: {
              [userId]: {
                status: 'Going'
              }
            }
          }
          var newTripKey = db.ref('trips/').push().key
          var newTrip = {}
          newTrip[newTripKey] = newTripData
          db.ref('trips/').update(newTrip)
          userRef.update({
            [userId]: {
              email: user.email,
              trips: [newTripKey],
              currTrip: newTripKey
            }
          })
          return newTripKey
        })
        .then((newTripKey) => {
          // console.log('Trying to grap default new Trip key', newTripKey)
          browserHistory.push('/dashboard/' + newTripKey)
        })
        .catch(error => {
          window.alert(error)
        })
    } else {
      window.alert('Please fill in both your email and password')
    }
  }

  render() {
    const auth = firebase.auth()

    const google = new firebase.auth.GoogleAuthProvider()
    const facebook = new firebase.auth.FacebookAuthProvider()
    const email = new firebase.auth.EmailAuthProvider()

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
                  .then(() => browserHistory.push('/dashboard'))
              }}>Sign up with Google</button>

          </div>
          <br />
          <div>
            <button className='facebook login btn btn-primary'
              onClick={() => {
                auth.signInWithPopup(facebook)
                  .then(() => browserHistory.push('/dashboard'))
              }}>Sign up with Facebook</button>

          </div>
        </div>
      </div>
    )
  }
}
