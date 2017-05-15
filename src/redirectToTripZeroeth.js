import firebase from 'APP/fire'
import {browserHistory} from 'react-router'

/*
Template:
import redirectToTripZeroeth from 'APP/src/redirectToTripZeroeth'
*/

export default function redirectToTripZeroeth(userId) {
  firebase.database().ref('users')
        .child(userId)
        .child('trips')
        .once('value')
        .then(snapshot => {
          const tripsArr = snapshot.val()
          if (tripsArr.length === 1) {
            return tripsArr[0]
          }
        })
        .then((tripId) => browserHistory.push('/dashboard/' + tripId))
        .catch(err => console.error(err))
}
