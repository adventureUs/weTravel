import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'

const auth = firebase.auth()



// Should be a stateful component --> local state has name, email, and password


export default class extends React.Component {
  constructor(props) {
    super(props)
    // no props currently
    this.state = {
      email: '',
      password: '',
    }
  }

  setEmailPassword = (evt) => {
    this.setState({ [evt.target.id]: evt.target.value })
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    // what we actually want to do is redirect to the dashboard view
    if (this.state.email.length && this.state.password.length) {
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
        // Should we have a pop-up to collect extra information such as zipcode, name
        .then(() => browserHistory.push('/dashboard'))
        .catch(error => {
          window.alert(error)
        })

    } else {
      window.alert('Please fill in both your email and password')
    }
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className="form-horizontal well">
        <legend className="col-lg-12" >Create an account with your e-mail and a password</legend>
        <div className="form-group">
          <label htmlFor="inputEmail" className="col-lg-2 control-label">Email</label>
          <div className="col-lg-10">
            <input type="email" className="form-control" id="email" placeholder="Email" onChange={this.setEmailPassword} />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="inputPassword" className="col-lg-2 control-label">Password</label>
          <div className="col-lg-10">
            <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.setEmailPassword} />
          </div>
        </div>
        <div className="form-group">
          <div className="col-lg-10 col-lg-offset-2">
            <button type="submit" className='btn btn-success'>Submit</button>
          </div>
        </div>
      </form>
    )
  }
}
