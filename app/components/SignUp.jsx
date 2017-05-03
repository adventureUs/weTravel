import React from 'react'
import firebase from 'APP/fire'

const auth = firebase.auth()

function onSubmit() {
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
  });

}

export const SignUp = ({ auth }) =>
<form className="form-horizontal">
    <fieldset>
      <legend className="col-lg-12" >Sign In</legend>
      <div className="form-group">
        <label htmlFor="inputEmail" className="col-lg-2 control-label">Email</label>
        <div className="col-lg-10">
          <input type="text" className="form-control" id="inputEmail" placeholder="Email" />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="inputPassword" className="col-lg-2 control-label">Password</label>
        <div className="col-lg-10">
          <input type="password" className="form-control" id="inputPassword" placeholder="Password" />
        </div>
      </div>
      <div className="form-group">
        <div className="col-lg-10 col-lg-offset-2">
          <button type="submit" className="btn btn-primary" onClick={() => auth.signInWithPopup(facebook)}>Submit</button>
        </div>
      </div>
    </fieldset>
  </form>
