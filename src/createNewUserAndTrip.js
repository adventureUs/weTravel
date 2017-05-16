import firebase from 'APP/fire'
const db = firebase.database()
import { browserHistory } from 'react-router'

  /* Use this one if there is not already any trips for a user:
  as in, only use this in SignUp The other is createNewTripForUserObj wiht is multitrip */

const createNewUserAndTrip = (user) => {
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
  db.ref('users').update({
    [userId]: {
      email: user.email,
      trips: [newTripKey]
    }
  })
    .then(() => {
      browserHistory.push('/dashboard/' + newTripKey)
    })
    .catch(error => {
      window.alert(error)
    })
}

export default createNewUserAndTrip
