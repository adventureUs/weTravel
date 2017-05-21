import React, { Component } from 'react'
import { RIEToggle, RIEInput, RIETextArea, REINumber, RIETags, RIESelect } from 'riek'
import { Route } from 'react-router'
import DatePicker from 'react-datepicker'
import WhoAmI from './WhoAmI'
import moment from 'moment'
import firebase from 'APP/fire'

const db = firebase.database()

export default class InlineBuddyEdit extends Component {
  constructor(props) {
    super(props)
    // in the future instead of e-mail add an additional field for preferred contact info
    // set scope on OAuth request and include phone number
    // We currently handle a case for new signup.
    // We need to consider the case for when someone is logged in and has info in the database. In this case, we want to get their
    // details from the database if they exist and if they don't exist, give the prompts.
    // some ternary like: if there is a logged in user and they have a name in the db, return the name. Otherwise return 'plase enter a name'.
    // same double condition needed for homeBase: if user logged in AND user has a homebase, grab it from the db and put it on initial state, otherwise ....

    // the goal here is to put buddy info from the buddies key from tripRef on state and keep aligned with the homebase on userRef

    this.state = {
      userId: props.userId,
      name: 'Please enter your name here',
      email: 'no email',
      status: 'Invited',
      homeBase: 'Please enter your city',
      startDate: '',
      endDate: '',
    }
  }

  componentDidMount() {
    // When the component mounts, start listening to the usersRef
    // we were given.
    this.props.auth.onAuthStateChanged(user => {
      user && this.setState({
        email: user.email
      })
    })
    this.listenTo(this.props.tripRef.child('/buddies').child(this.props.userId || 'test'))
  }
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  listenTo(ref) {
    if (this.unsubscribe) this.unsubscribe()
    const listener = ref.on('value', snapshot => {
      this.setState(snapshot.val())
    })
    this.unsubscribe = () => ref.off('value', listener)
    return listener
  }

  setLocalState = (e) => {
    e.preventDefault()
    if (e.target.name === 'status') {
      let userStatus={}
      switch (e.target.value) {
      case 'Going' :
        userStatus = { id: '2', text: 'Going' }
        break
      case 'Invited' :
        userStatus = { id: '1', text: 'Invited' }
        break
      case 'Can\'t make it' :
        userStatus = { id: '3', text: 'Can\'t make it' }
        break
      }
      this.setState({status: userStatus})
    } else {
      this.setState({[e.target.name]: e.target.value})
    }
  }

  postUserInfoToDB = (e) => {
    e.preventDefault()
    this.props.usersRef.child(this.props.userId)
      .update({
        name: this.state.name || 'Please enter your name',
        homeBase: this.state.homeBase || 'Please enter homebase',
      })
    this.props.tripRef.child('/buddies').child(this.props.userId || 'test')
      .update({
        name: this.state.name || 'Please enter your name',
        homeBase: this.state.homeBase || 'Please enter homebase',
        status: this.state.status,
        startDate: this.validateDate(this.state.startDate),
        endDate: this.validateDate(this.state.endDate)
      })
    document.getElementById('editYourInfoModal').style.display = 'none'
  }

  validateDate = (date) => {
    if (!date) return null
    else if (typeof date === 'string') return date
    else return date.toJSON()
  }

  handleChangeStart = (startDate) => {
    this.setState({
      startDate: startDate
    })
  }
  handleChangeEnd = (endDate) => {
    this.setState({
      endDate: endDate
    })
  }

  render() {
    // empty table headers are place holders.  No table heading needs to render.
    return (
      <form
        onSubmit={this.postUserInfoToDB}
        id="edit-user">
        <div className="container">
          <div>
          <table className="table">
            <thead>
              <tr>
                <th >
                </th>
                <th>
                </th>
              </tr>
            </thead>
            <tbody style={{height: '200px', display: 'flex', justifyContent: 'space-around', flexDirection: 'column'}}>
              <tr>
                <td>
                  <span>Name: </span>
                </td>
                <td className="buddyEditFields">
                  <input
                    type="text"
                    placeholder={this.state.name}
                    onChange={this.setLocalState}
                    className={this.state.highlight ? "editable" : ""}
                    name="name"
                    />
                </td>
              </tr>
              <tr>
                <td>
                  <span>Status: </span>
                </td>
                <td className="buddyEditFields">
                  <select
                  onChange={this.setLocalState}
                  name="status" >
                    <option value="Invited">Invited</option>
                    <option value="Going">Going</option>
                    <option value="Can't make it">Can't make it</option>
                  </select>
                  </td>
              </tr>
              <tr>
                <td>
                  <span>Home Base: </span>
                </td>
                <td className="buddyEditFields">
                  <input
                    type="text"
                    placeholder={this.state.homeBase}
                    onChange={this.setLocalState}
                    className={this.state.highlight ? "editable" : ""}
                    name="homeBase"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>Free from: </span>
                  </td>
                  <td>
                    <DatePicker
                      selected={this.state.startDate ? moment(this.state.startDate) : null}
                      onChange={this.handleChangeStart}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>Free until: </span>
                  </td>
                  <td>
                    <DatePicker
                      selected={this.state.endDate ? moment(this.state.endDate) : null}
                      onChange={this.handleChangeEnd}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <button
                      className="modal-add-buddy-button"
                      type="button"
                      className="btn btn-primary"
                      onClick={this.postUserInfoToDB}
                      form="edit-user">Save Info</button>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
      </form>
    )
  }
}
