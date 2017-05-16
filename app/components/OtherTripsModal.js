import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
const auth = firebase.auth()
import { RIEInput } from 'riek'
import idToNameOrEmail from '../../src/idToNameOrEmail'
import redirectToTripZeroeth from '../../src/redirectToTripZeroeth'

export default class OtherTripsModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newTripName: '',
      tripsWithNames: null // intended format is:
      // { tripId1: tripName1, tripId2: tripName2, ...}
    }
  }
  componentDidMount() {
    console.log('OTHER_TRIPS_MODAL ComponentWILLMOUNT,  PROPS', this.props)
    this.getTripsArrayWithNames()
  }
  componentWillUnmount() {
    console.log('OTHER_TRIPS_MODAL ComponentWILL_UNMOUNT')
    this.unsubscribeTripsRef && this.unsubscribeTripsRef()
    this.unsubscribeUserRef && this.unsubscribeUserRef()
  }
  getTripsArrayWithNames = () => {
    if (this.unsubscribeUserRef) { this.unsubscribeUserRef() }
    const userRefListener = this.props.userRef
      .on('value', snapshot => {
        console.log('OTHER_TRIPS_MODAL DID_MOUNT: userRefListener, snapshot', this.props.userRef, snapshot)
        let userObj = null
        if (snapshot) { userObj = snapshot.val() }
        if (userObj) {
          const trips = userObj.trips
          this.triggerTripsRefListener(trips)
        }
      })
    this.unsubscribeUserRef = () => this.props.userRef.off('value', userRefListener)
  }
  triggerTripsRefListener = (trips) => {
    if (this.unsubscribeTripsRef) { this.unsubscribeTripsRef() }
    const tripsRefListener = this.props.tripsRef
      .on('value', snapshot => {
        console.log('OTHER_TRIPS_MODAL DID_MOUNT: tripsRefListener, snapshot', this.props.tripsRef, snapshot)
        let tripsObj = null
        if (snapshot) { tripsObj = snapshot.val() }
        if (tripsObj) { this.updateTripsArrayWithNames(trips, tripsObj) }
      })
    this.unsubscribeTripsRef = () => this.props.userRef.off('value', tripsRefListener)
  }
  updateTripsArrayWithNames = (trips, tripsObj) => {
    const tripsWithNames = {}
    // loop over the users tripIds and find the tripName
    Object.keys(trips).forEach(key =>
      tripsWithNames[key] = tripsObj[key].tripName
    )
    this.setState(tripsWithNames)
  }

  changeTrip = (e) => {
    console.log('OTHER_TRIPS_MODAL, CHANGING TRIP...', 'CLICKED TRIP', e.traget)
    // slice trips and splice the e.target.id to zeroeth index
    this.props.userRef
      .once('value')
      .then(snapshot => {
        let userObj = null
        const targetTrip = e.target.id
        if (snapshot) { userObj = snapshot.val() }
        if (userObj) {
          const newTrips = userObj.trips.slice()
          newTrips.splice(newTrips.indexOf(targetTrip), 1)
          newTrips.unshift(targetTrip)
          console.log('OTHER_TRIPS_MODAL, CHANGING TRIP...', 'Old trips, new', userObj.trips, newTrips)
          this.props.userRef
            .update({ trips: newTrips })
        }
      })
      .catch(console.error)
    redirectToTripZeroeth(this.props.userId)
  }

  makeNewTrip = () => {
  }
    //   // Make a new trip with id, and add that id to currentUser.
    //   // Set the new trip Id to currentTrip, trigger rerender of new Dashboard
    //   console.log(document.getElementById('newTripInput').value)

  render() {
    console.log('STATE in OTHER_TRIPS_MODAL', this.state)
    const tripsWithNames = this.state.tripsWithNames
    return tripsWithNames ?
      (
      <div className="modal" id="tripsModal">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close"
                onClick={() =>
                  document.getElementById('tripsModal').style.display = 'none'}
              >&times;
              </button>
              <h4 className="modal-title">Your Trips</h4>
            </div>
            <div className="modal-body">
              {(Object.keys(tripsWithNames).map((tripId) =>
                <h4 id={`${tripId}`} key={`${tripId}`}
                  onClick={this.changeTrip}
                  style={{ border: 'bottom' }}
                ><font color='#18bc9c'>{tripsWithNames[tripId]}</font></h4>))}
            </div>
            <div className="modal-footer"
              style={{
                display: 'flex',
                justifyContent: 'space-around'
              }}>
              <input type="text" id="newTripInput"></input>
              <button type="button" className="btn btn-primary"
                onClick={this.makeNewTrip}>
                Add a trip
              </button>
            </div>
          </div>
        </div>
      </div>
    )
    :
    null
  }
}
