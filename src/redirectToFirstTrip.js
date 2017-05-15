import firebase from 'APP/fire'
import {browserHistory} from 'react-router'

export default function redirectToFirstTrip(userId) {
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
}
