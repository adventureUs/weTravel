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
    // We need to consider the case for when someone is logged in aand has info in the database. In this case, we want to get their
    // details from the database if they exist and if they don't exist, give the prompts.
    // some ternary like: if there is a logged in user and they have a name in the db, return the name. Otherwise return 'plase enter a name'.
    // same double condition needed for homeBase: if user logged in AND user has a homebase, grab it from the db and put it on initial state, otherwise ....

    // the goal here is to put buddy info from the buddies key from tripRef on state and keep aligned with the homebase on userRef

    this.state = {
      userId: props.userId,
      name: 'Please enter your name here',
      email: 'no email',
      status: { id: '1', text: 'Invited' },
      statusOptions: [
        { id: '1', text: 'Invited' },
        { id: '2', text: 'Going' },
        { id: '3', text: 'Can\'t make it' }
      ],
      homeBase: 'Please enter your city',
      startDate: '',
      endDate: '',
    }
  }

  componentDidMount() {
    // When the component mounts, start listening to the usersRef
    // we were given.
    this.props.auth.onAuthStateChanged(user => {
      this.setState({
        email: user.email
      })
    })

    // console.log('TRIP REF', this.props.tripRef.child('/buddies').child(this.props.userId || 'test'))
    // this.listenTo(
    //   this.props.tripRef.child('/buddies').child(this.props.userId || 'test')
    // )
  }

  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }

  componentWillReceiveProps(incoming, outgoing) {
    // When the props sent to us by our parent component change,
    // start listening to the new firebase reference.
    // console.log('FROM RECEIVE PROPS', incoming)
    this.listenTo(incoming.tripRef.child('/buddies').child(incoming.userId || 'test'))
    // this.listenTo(incoming.tripsRef.child(tripId))
  }

  listenTo(ref) {
    if (this.unsubscribe) this.unsubscribe()
  
    const listener = ref.on('value', snapshot => {
      console.log('SNAPSHOT VAL', snapshot.val())
      this.setState(snapshot.val())
    })
    this.unsubscribe = () => ref.off('value', listener)
    return listener
  }

  setLocalState = (newState) => {
    this.setState(newState)
    // this.updateDb()
  }

  postUserInfoToDB = (e) => {
    e.preventDefault()
    console.log('FROM POST TO DB', this.state)
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
    // console.log('REF FROM RENDER', db.ref('/trips/'+ this.props.tripId + '/buddies').child(this.props.userId || 'test'))
    // console.log('REF FROM RENDER', this.props.tripRef.child('/buddies').child(this.props.userId || 'test'))
    return (
      <form onSubmit={this.postUserInfoToDB}>
        <div className="container">
          <div className="form-horizontal">
            <div className="col-md-3">
              <span>Name: </span>
              <RIEInput
                value={this.state.name}
                change={this.setLocalState}
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
                change={this.setLocalState}
                classLoading="loading"
                propName="status" />
            </div>
            <div className="col-md-3">
              <span>Home Base: </span>
              <RIEInput
                value={this.state.homeBase}
                change={this.setLocalState}
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
