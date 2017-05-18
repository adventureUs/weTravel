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
      newTripName: ''
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
        if (!snapshot) return function() { }
        const tripObj = snapshot.val()
        idToNameOrEmail(this.props.userId)
          .then(nameOrEmail => this.setState({
            tripName: tripObj.tripName || 'Please name your trip!',
            userName: nameOrEmail
          })).catch(console.error)
      })
  }
  componentWillUnmount() {
    // console.log('TITLE BAR ComponentWILL_UNMOUNT')
    this.unsubscribe()
  }
  onInputChange = (evt) => {
    this.setState({newTripName: (evt.target.value || 'Please name your trip!')})
  }
  saveChanges = (evt) => {
    this.postTripNameToDB(this.state.newTripName)
    this.setState({
      tripName: this.state.newTripName || 'Please name your trip!',
    })
    this.refs.input.value = ''
    this.closeModal()
  }

  closeModal = () => {
    // console.log('Add buddy modal x click', e)
    document.getElementById('tripTitleModal').style.display = 'none'
  }

  postTripNameToDB = (newTripName) => {
    this.props.tripsRef.child('/' + this.props.tripId)
      .update({
        tripName: newTripName || 'New Trip Name',
      })
  }
  render() {
    return this.props.tripId ?
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
                <span>{this.state.tripName}</span>
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
                      value={this.state.newTripName}
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
