// A necessary glue?

import React from 'react'
import { Route } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
import Dashboard from './Dashboard'
import TitleBar from './TitleBar'
const auth = firebase.auth()

// NOT FINISHED NEED TO FINISH LOGIN FIRST BEFORE TESTING THIS:
 // PROBLEM: NOT EVEN GRABBING USER.UID IN DID MOUNT. No logging.

// the reason for this container is to allow for an enhancement
// to parameterize the route
// userRef will equal db.ref('users').child({name})
// and pass in name to the below function
export default class extends React.Component {
  constructor({params: { tripId }}) {
    super({params: { tripId }})
    this.state = {
      userId: '',
      tripId: tripId,
      // buddies: []
    }
  }
  componentWillMount() {
    this.unsubscribe = auth.onAuthStateChanged(user => {
      console.log('User & hopefully uid in AuthState', user)
      this.setState({userId: user.uid})
    })
  }

  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }

  componentWillReceiveProps(incoming, outgoing) {
  }
  render() {
    console.log('State in App looking at userId', this.state)
    return (
      <div>
        <TitleBar/>
        <Dashboard
          tripRef={db.ref('trips').child(this.state.tripId)}
          auth={auth}
          tripId={this.state.tripId}/>
      </div>
    )
  }
}

/* <TitleBar
          tripId={this.state.tripId}
          auth={auth}
          tripsRef={db.ref('trips')}
          userRef={db.ref('users').child(this.state.userId)}/> */
