import firebase from 'APP/fire'
const db = firebase.database()
const userRef = db.ref('users/')
// NOTA BENE: RETURNS A PROMISE, YOU MUST .THEN() OFF OF IT 


// when a valid UID is passed in,
// if the user entered in their name, the name is returned
// otherwise, the email is returned
export default function(uid) {
  let result = userRef.child(uid)
    .once('value')
    .then(snapshot => {
      const nameExists = snapshot.child('name').exists()
      nameExists
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
      .then(result => {
        console.log('should be the result of the utility function', result)
        return result
      })
      .catch(err => console.error(err))
    })
  return result
}
