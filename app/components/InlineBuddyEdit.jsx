import React, { Component } from 'react'
import { RIEToggle, RIEInput, RIETextArea, REINumber, RIETags, RIESelect } from 'riek'
import { Route } from 'react-router'
import DatePicker from 'react-datepicker'
import WhoAmI from './WhoAmI'
import moment from 'moment'
import firebase from 'APP/fire'
// const auth = firebase.auth()
const db = firebase.database()

// userRef might be bettter as usersRef since that reflects what it actually is; furthermore; removing the listener through userRef
// might be problematic;  furthermore; in Dashobard we may be wanting to listen through the particular trip so rerendierng isn't triggered
// changes to other trips and unrelated users. 

// WHEN CAN YOU DEFINE THE UID?  WE NEED TO GRAB AS SOON AS POSSIBLE
// receives  userRef={db.ref('users')} auth={auth} from container

export default class InlineBuddyEdit extends Component {
  constructor(props) {
    super(props)
    // in the future instead of e-mail add an additional field for preferred contact info
    // set scope on OAuth request and include phone number
    // We currently handle a case for new signup.
    // We need to consider the case for when someone is logged in aand has info in the database. In this case, we want to get their
    // details from the database if they exist and if they don't exist, give the prompts.
    // some ternary like: if there is a logged in user and they have a name in the db, return the name. Otherwise return 'plase enter a name'.
    // same double condition needed for homeBase: if user logged in AND user has a homebase, grab it from the db and put it on initial state, otherwise ....
    this.state = {
      uid: '',
      name: 'Please enter your name',
      email: 'no email',
      status: { id: '1', text: 'Invited' },
      statusOptions: [
        { id: '1', text: 'Invited' },
        { id: '2', text: 'Going' },
        { id: '3', text: 'Can\'t make it' }
      ],
      homeBase: 'Please enter your city',
      startDate: '',
      endDate:  ''


    }
  }

  componentDidMount() {
    // When the component mounts, start listening to the userRef
    // we were given.
    this.props.auth.onAuthStateChanged(user => {
      this.setState({
        uid: user.uid,
        email: user.email
      })
    })
    this.listenTo(this.props.userRef.child('/' + this.state.uid))
  }

  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }

  componentWillReceiveProps(incoming, outgoing) {
    // When the props sent to us by our parent component change,
    // start listening to the new firebase reference.
    this.listenTo(incoming.userRef)
  }

  listenTo(userRef) {
    // If we're already listening to a ref, stop listening there.
    if (this.unsubscribe) this.unsubscribe()
    // Whenever our ref's value changes, set {value} on our state.
    const listener = firebase.database()
                    .ref('users/' + this.state.uid)
                    .on('value', snapshot => {
                      this.setState(snapshot.val()[this.state.uid])
                    })
    // Set unsubscribe to be a function that detaches the listener.
    this.unsubscribe = () => userRef.off('value', listener)
  }

  virtualServerCallback = (newState) => {
    this.setState(newState)
    // this.updateDb()
  }

  postUserInfoToDB = (e) => {
    e.preventDefault()
    const uid = this.props.auth.currentUser.uid
    this.props.userRef.child(uid).set({
      name: this.state.name ? this.state.name : 'Please enter your name',
      homeBase: this.state.homeBase ? this.state.homeBase : 'Please enter homebase',
      status: this.state.status,
      startDate: this.validateDate(this.state.startDate),
      endDate: this.validateDate(this.state.endDate)
      // endDate: this.state.endDate ? this.state.endDate.toJSON() : null
    })
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
    return (
      <form onSubmit={this.postUserInfoToDB}>
        <h1>BUDDIES</h1>
        <div className="container">
          <div className="form-horizontal">
            <div className="col-md-3">
              <span>Name: </span>
              <RIEInput
                value={this.state.name}
                change={this.virtualServerCallback}
                propName="name"
                className={this.state.highlight ? "editable" : ""}
                validate={this.isStringAcceptable}
                classLoading="loading"
                classInvalid="Invalid" />
            </div>
            <div className="col-md-3">
              <span>Email: {this.state.email}</span>

            </div>
            <div className="col-md-3">
              <span>Status: </span>
              <RIESelect
                value={this.state.status}
                className={this.state.highlight ? "editable" : ""}
                options={this.state.statusOptions}
                change={this.virtualServerCallback}
                classLoading="loading"
                propName="status" />
            </div>
            <div className="col-md-3">
              <span>Home Base: </span>
              <RIEInput
                value={this.state.homeBase}
                change={this.virtualServerCallback}
                propName="homeBase"
                className={this.state.highlight ? "editable" : ""}
                validate={this.isStringAcceptable}
                classLoading="loading"
                classInvalid="Invalid" />
            </div>
            <div className="col-md-3">
              <span>Availability Start Date: </span>
              <DatePicker
                selected={this.state.startDate ? moment(this.state.startDate) : null}
                onChange={this.handleChangeStart}
              />
            </div>
            <div className="col-md-3">
              <span>Availability End Date: </span>
              <DatePicker
                selected={this.state.endDate ? moment(this.state.endDate) : null}
                onChange={this.handleChangeEnd}
              />
            </div>
          </div>
        </div>
        <button>Save Info</button>
      </form>
    )
  }
}
