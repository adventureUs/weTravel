import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
const auth = firebase.auth()
import { RIEInput } from 'riek'
import OtherTripsModal from './OtherTripsModal'
import idToNameOrEmail from '../../src/idToNameOrEmail'

// WILL THIS COMMENT FORCE THE MERGE TO ACTUALLY WORK?????
// WILL THIS OTHER COMMENT FORCE THE MERGE TO ACTUALLY WORK?????

export default class TitleBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tripName: '',
      userName: '',
      confirmedTripName: ''
    }
  }

  componentDidMount() {
    // console.log('TITLE BAR ComponentWILLMOUNT,  PROPS', this.props)
    this.unsubscribe = this.props.tripRef
      .on('value', snapshot => {
        // console.log('TITLE BAR DID_MOUNT: tripRef, snapshot', this.props.tripRef, snapshot)
        // Stef says: Weird edge case on logout:  tripRef and snapshot log as existing
        // but snapshot.val() finds snapshot undefined...
        // safety (hack?) is the if below:
        if (!snapshot) return function () { }
        const tripObj = snapshot.val()
        idToNameOrEmail(this.props.userId)
          .then(nameOrEmail => this.setState({
            tripName: tripObj.tripName,
            confirmedTripName: tripObj.tripName,
            userName: nameOrEmail
          })).catch(console.error)
      })
  }
  componentWillUnmount() {
    // console.log('TITLE BAR ComponentWILL_UNMOUNT')
    this.unsubscribe()
  }
  onInputChange = (evt) => {
    this.setState({ tripName: evt.target.value })
  }
  saveChanges = (evt) => {
    this.postTripNameToDB(this.state.tripName)
    this.setState({
      confirmedTripName: this.state.tripName,
      tripName: ''
    })
    this.refs.input.value = ''
    this.closeModal()
  }
  postTripNameToDB = (tripName) => {
    this.props.tripsRef.child('/' + this.props.tripId)
      .update({
        tripName: tripName || 'New Trip Name',
      })
  }
  render() {
    return this.state.confirmedTripName ?
      (
        <nav className="nav navbar-default navbar-fixed-top">
          <div className="" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>

            <img className="img"
              src="https://image.flaticon.com/icons/png/128/146/146267.png"
              style={{
                color: '#18bc9c',
                padding: '6px',
                height: '60px',
                width: '60px'
              }} />

            <div
              className='titleBarTitle'
              onClick={() =>
                document.getElementById('tripTitleModal').style.display = 'block'}>
              <h4 className='tripnameIcon'>
                <span>{this.state.confirmedTripName}</span>
                <span className='glyphicon glyphicon-pencil pencil'></span>
              </h4>
            </div>
            <div className="modal" id="tripTitleModal">
              <div className="modal-dialog modal-sm">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close"
                      onClick={this.closeModal}
                    >&times;
                    </button>
                    <h4 className="modal-title">Update Your Trip Name</h4>
                  </div>
                  <div className="modal-body modal-input-height">
                    <input
                      ref="input"
                      className="modal-trip-edit-input form-control"
                      placeholder="Please Enter Your New Trip Name Here"
                      value={this.state.tripName}
                      onChange={this.onInputChange}
                      type="text"
                      id="tripName" />
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-warning"
                      onClick={this.closeModal}
                    >Cancel</button>
                    <button
                      className="btn btn-success"
                      onClick={this.saveChanges}
                    >Save Changes</button>
                  </div>
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '5px'
            }}>
              <h4 className="" style={{ padding: '5px' }}>
                <font color="white">{auth.currentUser
                  ? `Welcome, ${this.state.userName}!`
                  : ''}</font>
              </h4>
              <button style={{
              color: '#18bc9c',
              backgroundColor: '#ffffff',
              borderRadius: '5px',
              padding: '5px'
            }}
              type="button"
              onClick={() =>
                document.getElementById('other-trips-modal').style.display = 'block'}
              >Trip List</button>
            <OtherTripsModal
              tripRef={this.props.tripRef}
              tripsRef={this.props.tripsRef}
              userId={this.props.userId}
              userRef={this.props.userRef}
              />
              {auth && auth.currentUser ?
                <button className='logout'
                  style={{
                    color: '#18bc9c',
                    backgroundColor: '#ffffff',
                    borderRadius: '5px',
                    padding: '3px 6px'
                  }}
                  onClick={() => {
                    auth.signOut()
                    browserHistory.push('/login')
                  }}>logout
                </button>
                :
                <button className='login'
                  style={{
                    color: '#18bc9c',
                    backgroundColor: '#ffffff',
                    borderRadius: '5px',
                    padding: '3px 6px'
                  }}
                  onClick={() => browserHistory.push('/login')}>
                  login</button>
              }
            </div>
          </div >
        </nav >
      )
      :
      null
  }
}

{ /*   setStates = (newState) => {
    this.setState(newState)
    this.postTripNameToDB(newState.tripName)
  } */ }
