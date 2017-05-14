// A necessary glue?

import React from 'react'
import { Route, browserHistory } from 'react-router'
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
  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      tripId: props.params.tripId,
      // buddies: []
    }
  }

  componentWillMount() {
    // Stef says: It occurs to me that here we may not want a listener
    // but a once off check... Am funelling down the unsub to the
    // TitleBar to try to redirect properly on logout.
    this.unsubscribeAuth = auth.onAuthStateChanged(user => {
      console.log('APP COMPONENT_WILL_MOUNT, USER: ', user)
      user ?
      this.setState({
        userId: user.uid
      }) : browserHistory.push('/login?' + this.props.params.tripId)
    })
    this.unsubscribeAuth = this.unsubscribeAuth.bind(this)
  }
  componentWillUnmount() {
    this.unsubscribeAuth && this.unsubscribeAuth()
  }
  render() {
    // console.log('STATE in APP:', this.state)
    // console.log('TRIP REF in APP:', db.ref('/trips/'+ this.props.params.tripId))
    return (
      <div>
        <TitleBar
          auth={auth}
          unsubscribeAuth={this.unsubscribeAuth}
          tripsRef={db.ref('trips')}
          tripId={this.state.tripId}
          userId={this.state.userId ? this.state.userId : 'test'}
          userRef={db.ref('users').child(this.state.userId ? this.state.userId : 'test')}
          tripRef={db.ref('trips').child(this.state.tripId)}
          />
        <Dashboard
          userId={this.state.userId}
          tripRef={db.ref('/trips/'+ this.props.params.tripId)}
          auth={auth}
          tripId={this.state.tripId}
          />
      </div>
    )
  }
}
