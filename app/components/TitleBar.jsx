import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
const auth = firebase.auth()
const trips = ['Rome', 'Montenegro']
import { RIEInput } from 'riek'
import idToNameOrEmail from '../../src/idToNameOrEmail'

export default class TitleBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tripName: '',
      userName: '',
      confirmedTripName: ''
    }
    // this.closeModal = this.closeModal.bind(this)
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
            confirmedTripName: tripObj.tripName,
            userName: nameOrEmail
          })).catch(console.error)
      })
  }
  componentWillUnmount() {
    // console.log('TITLE BAR ComponentWILL_UNMOUNT')
    this.unsubscribe()
  }

  getAllTrips() {
    // Get other trip name via currentUser's associated trip Ids
  }

  // changeTrip = (e) => {}
  //   // Note: change map over trips to reflect actualy trip id and names.
  //   // e.target.id set to currentTrip
  //   browserHistory.push('/dashboard/'+this.props.tripId)

  makeNewTrip() {
  }
  //   // Make a new trip with id, and add that id to currentUser.
  //   // Set the new trip Id to currentTrip, trigger rerender of new Dashboard
  //   console.log(document.getElementById('newTripInput').value)

  onInputChange = (evt) => {
    this.setState({ tripName: evt.target.value })
  }

  closeModal = () => {
    // console.log('Add buddy modal x click', e)
    document.getElementById('tripTitleModal').style.display = 'none'
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
// Bttn and Modal for All Trips:

// <button style={{
//               color: '#18bc9c',
//               backgroundColor: '#ffffff',
//               borderRadius: '5px',
//               padding: '1px 6px'
//             }}
//               type="button"
//               onClick={() =>
//                 document.getElementById('tripsModal').style.display = 'block'}
//             >+</button>

//   <div className="modal" id="tripsModal">
//     <div className="modal-dialog modal-sm">
//       <div className="modal-content">
//         <div className="modal-header">
//           <button type="button" className="close"
//             onClick={() =>
//               document.getElementById('tripsModal').style.display = 'none'}
//           >&times;
//           </button>
//           <h4 className="modal-title">Your Trips</h4>
//         </div>
//         <div className="modal-body">
//           {(this.getAllTrips().map((trip, idx) =>
//             <h4 id={`${idx}`} key={`${idx}`}
//               onClick={this.changeTrip}
//               style={{ border: 'bottom' }}
//             ><font color='#18bc9c'>{trip}</font></h4>))}
//         </div>
//         <div className="modal-footer"
//           style={{
//             display: 'flex',
//             justifyContent: 'space-around'
//           }}>
//           <input type="text" id="newTripInput"></input>
//           <button type="button" className="btn btn-primary"
//             onClick={this.makeNewTrip}>
//             Add a trip
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
