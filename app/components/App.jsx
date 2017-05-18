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
    }
  }

  componentWillMount() {
    // we're setting up the tripId route here
    firebase.auth().currentUser ?
    this.setState({
      userId: auth.currentUser.uid
    }) : browserHistory.push('/login?' + this.props.params.tripId)
  }
  // Triggering re-render of entire app when changing Trips.
  setAppTripIdState = (tripId) => {
    this.setState({tripId: tripId})
  }
  render() {
    // console.log('STATE in APP:', this.state)
    // console.log('TRIP REF in APP:', db.ref('/trips/'+ this.props.params.tripId))
    return this.state.userId ?
      (
      <div className='app-container'>
        <TitleBar
          auth={auth}
          tripsRef={db.ref('trips')}
          tripId={this.state.tripId}
          userId={this.state.userId ? this.state.userId : 'test'}
          userRef={db.ref('users').child(this.state.userId ? this.state.userId : 'test')}
          tripRef={db.ref('trips').child(this.state.tripId)}
          setAppTripIdState={this.setAppTripIdState}
          />
        <Dashboard
          userId={this.state.userId}
          tripRef={db.ref('/trips/'+ this.props.params.tripId)}
          auth={auth}
          tripId={this.state.tripId}
          />
      </div>
    )
    :
    null
  }
}
