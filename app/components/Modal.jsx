import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'
const auth = firebase.auth()

// Connect modal to db
// Fetch trip data from the db
// Fetch current user
// Data from db needs to be immutable?


export default class extends React.Component {
  constructor(props) {
    super(props)
  }

  getTripName() {
    // Get the trip name for the trip set as currentTrip
    return 'Trip Name'
  }
  getAllTrips() {
    // Get other trip names via currentUser's associated trip Ids
    return trips
  }
  changeTrip(e) {
    // Note: change map over trips to reflect actualy trip id and names.
    // console.log(e.target.id)
    // e.target.id set to currentTrip
    browserHistory.push('/dashboard')
  }
  makeNewTrip() {
    // Make a new trip with id, and add that id to currentUser.
    // Set the new trip Id to currentTrip, trigger rerender of new Dashboard
    // console.log(document.getElementById('newTripInput').value)
  }
}
