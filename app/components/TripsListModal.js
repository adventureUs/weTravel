import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
const auth = firebase.auth()
import { RIEInput } from 'riek'
import idToNameOrEmail from '../../src/idToNameOrEmail'
import redirectToTripZeroeth from '../../src/redirectToTripZeroeth'
import createNewTripForUserObj from '../../src/createNewTripForUserObj'

export default class TripsListModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newTripName: null,
      tripsWithNames: null, // intended format is:
      // { tripId1: tripName1, tripId2: tripName2, ...}
      defaultTripName: 'Please Name Your Trip Here!'
    }
  }

  componentWillReceiveProps() {
    this.setTripsArrayWithNames()
  }

  componentDidMount() {
    this.setTripsArrayWithNames()
  }

  componentWillUnmount() {
    this.unsubscribeTripsRef && this.unsubscribeTripsRef()
    this.unsubscribeUserRef && this.unsubscribeUserRef()
  }

  setTripsArrayWithNames = () => {
    if (this.unsubscribeUserRef) { this.unsubscribeUserRef() }
    const userRefListener = this.props.userRef
      .on('value', snapshot => {
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
        let tripsObj = null
        if (snapshot) { tripsObj = snapshot.val() }

        if (tripsObj) { this.updateTripsArrayWithNames(trips, tripsObj) }
      })
    this.unsubscribeTripsRef = () => this.props.userRef.off('value', tripsRefListener)
  }

  updateTripsArrayWithNames = (trips, tripsObj) => {
    const tripsWithNames = {}
    // loop over the users tripIds and find the tripName
    trips.forEach(tripId =>
      tripsWithNames[tripId] = tripsObj[tripId].tripName === this.state.defaultTripName ?
        'Please Enter Trip Name'
        :
        tripsObj[tripId].tripName
    )
    this.setState({tripsWithNames: tripsWithNames})
  }

  changeTrip = (e) => {
    /* Here we are using the react event persist method:
    e is nullified before the asynch gets to it, so we are presisting */
    e.persist()
    this.props.userRef
      .once('value')
      .then(snapshot => {
        let userObj = null
        const targetTrip = e.target.id
        if (snapshot) { userObj = snapshot.val() }
        if (userObj) {
          // slice trips and splice the e.target.id to zeroeth index
          const newTrips = userObj.trips.slice()
          newTrips.splice(newTrips.indexOf(targetTrip), 1)
          newTrips.unshift(targetTrip)
        // HERE TEST THIS UPDATE PLEASE:  THEN LOG FROM REDIRECT!!!
          this.props.userRef
            .update({ trips: newTrips })
            .then(() => {
              document.getElementById('other-trips-modal').style.display = 'none'
              this.props.setAppTripIdState(targetTrip)
              browserHistory.push('/dashboard/' + targetTrip)
            })
        }
      })
      .catch(console.error)
  }
  /* Make a new trip with id, and add that tripId to currentUser.
  as zeroeth trip, trigger rerender of new Dashboard/tripId */
  makeNewTrip = () => {
    document.getElementById('other-trips-modal').style.display = 'none'
    createNewTripForUserObj(this.props.userId, this.state.newTripName)
  }

  render() {
    const tripsWithNames = this.state.tripsWithNames
    return (
      <div className="modal" id='other-trips-modal'>
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button"
                      className="close"
                      onClick={() =>
                        document.getElementById('other-trips-modal').style.display = 'none'}
                    >&times;
              </button>
              <h4 className="modal-title">Your Trips</h4>
            </div>
            <div className="modal-body">
              {
                tripsWithNames ?
                (Object.keys(tripsWithNames).sort().map((tripId) =>
                <h4 key={`${tripId}`}
                    onClick={this.changeTrip}
                    style={{ border: 'bottom' }}
                ><font
                  id={`${tripId}`}
                  color='black'
                  onClick={this.changeTrip}
                  >{tripsWithNames[tripId]}
                </font></h4>))
                :
                <div>Oopsies, the tripsNames nono on state</div>
              }
            </div>
            <div className="modal-footer"
                 style={{
                   display: 'flex',
                   justifyContent: 'space-around'
                 }}>
              <input
                type="text"
                id="newTripInput"
                onChange={ (e) => this.setState({newTripName: e.target.value})}
                >
                </input>
              <button type="button"
                      className="btn btn-primary"
                      onClick={this.makeNewTrip}>
                Add a trip
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
