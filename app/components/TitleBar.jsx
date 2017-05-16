import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
const auth = firebase.auth()
import { RIEInput } from 'riek'
import OtherTripsModal from './OtherTripsModal'
import idToNameOrEmail from '../../src/idToNameOrEmail'

export default class TitleBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tripName: '',
      userName: ''
    }
  }
  componentDidMount() {
    // console.log('TITLE BAR ComponentWILLMOUNT,  PROPS', this.props)
    this.unsubscribe = this.props.tripRef
    .on('value', snapshot => {
      // console.log('TITLE BAR DID_MOUNT: tripRef, snapshot', this.props.tripRef, snapshot)
      /* Stef says: Weird edge case on logout:  tripRef and snapshot log as existing
       but snapshot.val() finds snapshot undefined...
       safety (hack?) is the if below: */
      if (!snapshot) return function() {}
      const tripObj = snapshot.val()
      idToNameOrEmail(this.props.userId)
      .then(nameOrEmail => this.setState({
        tripName: tripObj.tripName,
        userName: nameOrEmail
      })).catch(console.error)
    })
  }
  componentWillUnmount() {
    // console.log('TITLE BAR ComponentWILL_UNMOUNT')
    this.unsubscribe()
  }
  setStates = (newState) => {
    this.setState(newState)
    this.postTripNameToDB(newState.tripName)
  }
  postTripNameToDB = (tripName) => {
    this.props.tripsRef.child('/' + this.props.tripId)
      .update({
        tripName: tripName || 'New Trip Name',
      })
  }
  render() {
    // console.log('STATE in TITLEBAR', this.state)
    return this.state.tripName ?
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
              // filter: 'invert(100%)'
            }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '5px'
          }}>
            <h4>
              <RIEInput
                value={this.state.tripName}
                change={this.setStates}
                propName="tripName"
                className={this.state.highlight ? 'editable' : ''}
                validate={this.isStringAcceptable}
                classLoading="loading"
                classInvalid="Invalid"
                className="titleBarTitle"
              />
            </h4>
            <button style={{
              color: '#18bc9c',
              backgroundColor: '#ffffff',
              borderRadius: '5px',
              padding: '1px 6px'
            }}
              type="button"
              onClick={() =>
                document.getElementById('tripsModal').style.display = 'block'}
              >+</button>
            <OtherTripsModal
              tripRef={this.props.tripRef}
              tripsRef={this.props.tripsRef}
              userId={this.props.userId}
              userRef={this.props.userRef}
              />
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
        </div>
      </nav>
    )
    :
    null
  }
}
