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
      status: 'Invited',
      // statusOptions: [
      //   { id: '1', text: 'Invited' },
      //   { id: '2', text: 'Going' },
      //   { id: '3', text: 'Can\'t make it' }
      // ],
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

    // console.log('TRIP REF', this.props.tripRef.child('/buddies').child(this.props.userId || 'test'))
    // this.listenTo(
    //   this.props.tripRef.child('/buddies').child(this.props.userId || 'test')
    // )
  }
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
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
      // console.log('SNAPSHOT VAL', snapshot.val())
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
         console.log('in going user status', e.target.value)
        break
      case 'Invited' :
        userStatus = { id: '1', text: 'Invited' }
        break
      case 'Can\'t make it' :
        console.log('in cant make it target.value', e.target.value)
        userStatus = { id: '3', text: 'Can\'t make it' }
        console.log('in cant make it user status', e.target.value)
        break
      default :
        console.log('in default', e.target.value)
      }
      this.setState({status: userStatus})
    } else {
      this.setState({[e.target.name]: e.target.value})
    }
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
    // console.log('REF FROM RENDER', db.ref('/trips/'+ this.props.tripId + '/buddies').child(this.props.userId || 'test'))
    // console.log('REF FROM RENDER', this.props.tripRef.child('/buddies').child(this.props.userId || 'test'))
    return (
      <form
        onSubmit={this.postUserInfoToDB}
        id="edit-user">
        <div className="container">
          <div className="form-horizontal">
          <table>
            <tbody>
              <tr>
                <td>
                  <span>Name: </span>
                </td>
                <td className="buddyEditFields">
                </td>
                <p>    </p>
                <td>
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
                <p>    </p>
                </td>
                <td >
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
                <p>    </p>
                </td>
                <td>
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
                <td className="buddyEditFields">
                <p>    </p>
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
                <td className="buddyEditFields">
                <p>    </p>
                </td>
                  <td>
                    <DatePicker
                      selected={this.state.endDate ? moment(this.state.endDate) : null}
                      onChange={this.handleChangeEnd}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        <button
          className="modal-add-buddy-button"
          type="button"
          className="btn btn-primary"
          onClick={this.postUserInfoToDB}
          form="edit-user">Save Info</button>
      </form>
    )
  }
}

/*   render() {
    // console.log('REF FROM RENDER', db.ref('/trips/'+ this.props.tripId + '/buddies').child(this.props.userId || 'test'))
    // console.log('REF FROM RENDER', this.props.tripRef.child('/buddies').child(this.props.userId || 'test'))
    return (
      <form onSubmit={this.postUserInfoToDB}>
        <div className="container">
          <div className="form-horizontal">
            <div>
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
            <br />
            <div>
              <span>Status: </span>
              <RIESelect
                value={this.state.status}
                className={this.state.highlight ? "editable" : ""}
                options={this.state.statusOptions}
                change={this.setLocalState}
                classLoading="loading"
                propName="status" />
            </div>
            <br />
            <div>
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
            <br />
            <div>
              <span>Free from: </span>
              <DatePicker
                selected={this.state.startDate ? moment(this.state.startDate) : null}
                onChange={this.handleChangeStart}
              />
            </div>
            <br />
            <div>
              <span>Free until: </span>
              <DatePicker
                selected={this.state.endDate ? moment(this.state.endDate) : null}
                onChange={this.handleChangeEnd}
              />
            </div>
          </div>
        </div>
        <button
          className="modal-add-buddy-button"
          type="button"
          className="btn btn-primary">Save Info</button>
      </form>
    )
  } */
