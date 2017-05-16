import firebase from 'APP/fire'
const db = firebase.database()
import { browserHistory } from 'react-router'


/* Make a new trip as zeroeth position for user by Id
 and then redirect there.
 import createNewTripForUserObj from '../../src/createNewTripForUserObj'
 */

const createNewTripForUserObj = (userId, tripName) => {
  console.log('GOT INTO CREATE-NEW-TRIP', userId)
  const newTripKey = db.ref('trips/').push().key
  db.ref('users').child(userId)
    .once('value')
    .then(snpashot => {
      if (snapshot && snapshot.val()) {
        // add in name and homeBase to buddies data for first off rendering attractivness.
        const userObj = snapshot.val()
        const newTripData = {
          tripName: tripName ||'Please Name Your Trip Here!',
          buddies: {
            [userId]: {
              name: userObj.name,
              homeBase: userObj.homeBase,
              status: { id: '2', text: 'Going' }
            }
          }
        }
        var newTrip = {}
        newTrip[newTripKey] = newTripData
        db.ref('trips/').update(newTrip)
      }
    })

  const userTripsArrayRef = db.ref('users').child(userId).child('trips')
  userTripsArrayRef
    .once('value')
    .then(snapshot => {
      if (snapshot && snapshot.val()) {
        let newTrips = snapshot.val()
        newTrips.unshift(newTripKey)
        userTripsArrayRef.set(newTrips)
      }
    })
    .then(() => {
      browserHistory.push('/dashboard/' + newTripKey)
    })
    .catch(error => {
      window.alert(error)
    })
}

export default createNewTripForUserObj
