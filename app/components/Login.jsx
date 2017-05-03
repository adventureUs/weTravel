import React from 'react'
import firebase from 'APP/fire'

const google = new firebase.auth.GoogleAuthProvider()

// Firebase has several built in auth providers:
const facebook = new firebase.auth.FacebookAuthProvider()
// const twitter = new firebase.auth.TwitterAuthProvider()
// const github = new firebase.auth.GithubAuthProvider()
// // This last one is the email and password login we all know and
// // vaguely tolerate:
const email = new firebase.auth.EmailAuthProvider()

// If you want to request additional permissions, you'd do it
// like so:
//
// google.addScope('https://www.googleapis.com/auth/plus.login')
//
// What kind of permissions can you ask for? There's a lot:
//   https://developers.google.com/identity/protocols/googlescopes
//
// For instance, this line will request the ability to read, send,
// and generally manage a user's email:
//
// google.addScope('https://mail.google.com/')

export default ({ auth }) =>
  // signInWithPopup will try to open a login popup, and if it's blocked, it'll
  // redirect. If you prefer, you can signInWithRedirect, which always
  // redirects.
  // <form className='form-horizontal'>
  //   <fieldset>
  //     <div className="form-group">
  //       <legend>Log In</legend>
  //       <button className='google login'
  //         onClick={() => auth.signInWithPopup(google)}>Login with Google</button>
  //     </div>
  //     <div className="form-group">
  //       <label for="inputEmail" className="col-lg-2 control-label">Email</label>
  //       <div className="col-lg-10">
  //         <input type="text" className="form-control" id="inputEmail" placeholder="Email" />
  //       </div>
  //     </div>
  //     <div className="form-group">
  //       <label for="inputPassword" className="col-lg-2 control-label">Password</label>
  //       <div className="col-lg-10">
  //         <input type="password" className="form-control" id="inputPassword" placeholder="Password" />
  //       </div>

  //       <div className="form-group">
  //         <div className="col-lg-10 col-lg-offset-2">
  //           <button type="reset" className="btn btn-default">Cancel</button>
  //           <button type="submit" className="btn btn-primary">Submit</button>
  //         </div>
  //       </div>
  //     </div>
  //   </fieldset>
  // </form>

  <form className="form-horizontal">
    <fieldset>
      <legend className="col-lg-12" >Legend</legend>
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
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </div>
    </fieldset>
  </form>




