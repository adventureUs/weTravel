import firebase from '/APP'
const db = firebase.database()
const userRef = db.ref('users/')

// when a valid UID is passed in,
// if the user entered in their name, the name is returned
// otherwise, the email is returned
export default function(uid) {
  userRef.child(uid)
    .child('name')
    .exists()
      ?
      userRef.child(uid)
        .child('name')
        .once('value')
        .then(snapshot => {
          return snapshot.val()
        })
        :
        userRef.child(uid)
        .child('email')
        .once('value')
        .then(snapshot => {
          return snapshot.val()
        })
}
