import React from 'react'
import { Link, browserHistory } from 'react-router'
import firebase from 'APP/fire'
const db = firebase.database()
const auth = firebase.auth()
let trips = ['Rome', 'Montenegro']
import { RIEInput } from 'riek'

export default class TitleBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tripName: ''
    }
  }

  componentDidMount() {
    db.ref('trips').child('/' + this.props.tripId + '/name')
      .on('value', snapshot => {
        this.setState({ tripName: snapshot.val() })
      })
    console.log('STATE', this.state)
  }


  getAllTrips = () =>
    // Get other trip name via currentUser's associated trip Ids
    trips

  changeTrip = (e) =>
    // Note: change map over trips to reflect actualy trip id and names.
    // e.target.id set to currentTrip
    browserHistory.push('/dashboard')

  makeNewTrip = () =>
    // Make a new trip with id, and add that id to currentUser.
    // Set the new trip Id to currentTrip, trigger rerender of new Dashboard
    console.log(document.getElementById('newTripInput').value)

  setLocalState = (newState) => {
    this.setState(newState)
    // this.updateDb()
  }

  render() {
    console.log('STATE in TITLEBAR', this.state)
    return (
      <nav className="nav navbar-default">
        <div className="" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>

          <img className="img"
            src="favicon.ico"
            style={{
              color: '#18bc9c',
              padding: '6px',
              height: '60px',
              filter: 'invert(100%)'
            }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '5px'
          }}>
            <h4 style={{ color: '#ffffff' }}>
              <RIEInput
                value={this.state.tripName}
                change={this.setLocalState}
                propName="tripName"
                className={this.state.highlight ? "editable" : ""}
                validate={this.isStringAcceptable}
                classLoading="loading"
                classInvalid="Invalid"
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
                    {(this.getAllTrips().map((trip, idx) =>
                      <h4 id={`${idx}`} key={`${idx}`}
                        onClick={this.changeTrip}
                        style={{ border: 'bottom' }}
                      ><font color='#18bc9c'>{trip}</font></h4>))}
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
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '5px'
          }}>
            <h4 className="" style={{ padding: '5px' }}>
              <font color="white">{auth.currentUser
                ? `Welcome, ${auth.currentUser.displayName || auth.currentUser.email}!`
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
  }
}
