'use strict'
import React from 'react'
import { Router, Route, IndexRedirect, browserHistory } from 'react-router'
import { render } from 'react-dom'

// import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import Login from './components/Login'
import SignUp from './components/SignUp'
import App from './components/App'
import InlineBuddyEditIndex from './components/InlineBuddyEditIndex'
import firebase from 'APP/fire'
import redirectToFirstTrip from 'APP/src/redirectToFirstTrip'
// ---- UNCOMMENT TO RESEED DATABASE ----------
// import {trips, users} from '../seedData'
// console.log('USERS', users, 'TRIPS', trips)
// firebase.database().ref('trips/').set(trips)
// firebase.database().ref('users/').set(users)

// Get the auth API from Firebase.
const auth = firebase.auth()
const google = new firebase.auth.GoogleAuthProvider()
const email = new firebase.auth.EmailAuthProvider()
// Deleted facebook --> can reimplement if we have time, hahahahhaahahaahhah

export default class Container extends React.Component {
  constructor() {
    super()
    this.state = {
      user: null
    }
  }
  componentWillMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => {
      // console.log('CONTAINER COMPONENT_WILL_MOUNT, USER: ', user)
      this.setState({
        user: user
      })
      if (!user) {
        browserHistory.push('/login')
      } else {
        redirectToFirstTrip(user.uid)
      }
    })
  }
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }
  render() {
    // console.log('CONTAINER in MAIN, currentUser', firebase.auth().currentUser)
    return (
      <div className="container-fluid">
        {
          this.state.user ? null : <Login />
        }
      </div>
    )
  }
}

render(
  <Router history={browserHistory}>
    <Route path="/" component={Container} />
    <Route path="login" component={Login} google={google} email={email} />
    <Route path="dashboard/:tripId" component={App} />
    <Route path="signup" component={SignUp} google={google} email={email} />
    <Route path="/travelbuddies/email" component={InlineBuddyEditIndex} />
    <Route path='*' component={NotFound} />
  </Router>,
  document.getElementById('main')
)
