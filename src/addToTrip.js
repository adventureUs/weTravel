import firebase from 'APP/fire'
const db = firebase.database()
import { browserHistory } from 'react-router'

// addToTrip adds a pending buddy with an invite query string to an existing trip,
// and then redirects the user to the dashboard
const addToTrip = (user, queryString) => {
  // console.log('GOT INTO ADD-TO-TRIP', user)

  const userId = user.uid
  const tripId = queryString.slice(1)

  // first updates trips table by adding this new user to the buddies portion of the particular trip table
  db.ref('trips/').child(tripId).child('buddies').update({
    [userId]: {
      status: { id: '1', text: 'Invited' }
    }
  })

  // In the users table, creates a new user with the querystring as the the trip
  db.ref('users/').update({
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

export default addToTrip
