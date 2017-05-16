import React from 'react'
import ReactTooltip from 'react-tooltip'
import SetClass from 'react-classset'
import firebase from 'APP/fire'
import InlineBuddyEditIndex from './InlineBuddyEditIndex'
import moment from 'moment'
import CopyToClipboard from 'react-copy-to-clipboard'
import AddBuddyModal from './AddBuddyModal'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      buddies: {}, // there's nothing on state when we go to the buddies tab
      clipboard: `https://tern-2b37d.firebaseapp.com${window.location.pathname}`,
      copied: ''
    }
  }
  componentDidMount() {
    this.listenTo(this.props.tripRef.child('buddies'))
    //     console.log('COMPONENT DID MOUNT PROPS', this.props.tripRef.child('buddies'))
  }
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }
  componentWillReceiveProps(incoming, outgoing) {
    // When the props sent to us by our parent component change,
    // start listening to the new firebase reference.
    // console.log('FROM RECEIVE PROPS', incoming)
    this.listenTo(incoming.tripRef.child('buddies')) // this ref is undefined
    // this.listenTo(incoming.tripsRef.child(tripId))
  }
  listenTo(ref) {
    if (this.unsubscribe) this.unsubscribe()
    const listener = ref.on('value', snapshot => {
      var buddies = {}
      // for (var buddy in snapshot.val()) { buddies.push({[buddy]: snapshot.val()[buddy]}) }
      // changed to an object
      this.setState({ buddies: snapshot.val() })
    })
    this.unsubscribe = () => ref.off('value', listener)
  }
  buildRow = (buddyId) => {
    const buddyClass = SetClass({
      'me': buddyId === this.props.userId,
      'them': buddyId !== this.props.userId
    })
    return (
      <tr key={buddyId} className='trip-buddies'>
        <td className={buddyClass}>{this.state.buddies[buddyId].name || 'Add your name here'}</td>
        <td className={buddyClass}> {this.state.buddies[buddyId].homeBase || 'Add your city here'}</td>
        <td className={buddyClass}> {this.state.buddies[buddyId].status.text}</td>
        <td className={buddyClass}>
          {(this.state.buddies[buddyId].startDate)
            ? this.state.buddies[buddyId].startDate.slice(0, 10)
            : 'TBD'}</td>
        <td className={buddyClass}>
          {(this.state.buddies[buddyId].endDate)
            ? this.state.buddies[buddyId].endDate.slice(0, 10)
            : 'TBD'}</td>
        <td className={buddyClass}>
          {(buddyId === this.props.userId)
            ?
            <div>
              <button style={{
                color: '#18bc9c',
                backgroundColor: '#ffffff',
                borderRadius: '5px',
                padding: '1px 6px'
              }}
                type="button"
                onClick={() =>
                  document.getElementById('editYourInfoModal').style.display = 'block'}
                data-tip="Edit your name, home base, status, and start & end dates."
              >Edit</button>
              <ReactTooltip />
            </div>

            : <div></div>
          }
        </td>
      </tr>
    )
  }
  render() {
    return (
      <div className="well well-lg">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th className="buddyHeader">Name</th>
              <th className="buddyHeader">Home Base</th>
              <th className="buddyHeader">Status</th>
              <th className="buddyHeader">Free From</th>
              <th className="buddyHeader">Free until</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.buddies && Object.keys(this.state.buddies)
                .map((buddyId) => this.buildRow(buddyId))
            }
          </tbody>
        </table>
        <div>
          <button className="appBttn" style={{
            color: '#18bc9c',
            backgroundColor: '#ffffff',
            borderRadius: '5px',
            padding: '1px 6px'
          }}
            type="button"
            onClick={() =>
              document.getElementById('addBuddyModal').style.display = 'block'}
            data-tip="Add some buddies to your trip!"
          >Add a Buddy!</button>
          <ReactTooltip />
        </div>
        <AddBuddyModal tripRef={this.props.tripRef}/>

        <div className="modal" id="editYourInfoModal">
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close"
                  onClick={() =>
                    document.getElementById('editYourInfoModal').style.display = 'none'}
                >&times;
                </button>
                <h4 className="modal-title">Edit Your Personal Info</h4>
              </div>
              <div className="modal-body">
                <InlineBuddyEditIndex
                  userId={this.props.userId}
                  tripRef={this.props.tripRef}
                  tripId={this.props.tripId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

 /* }

        <InlineBuddyEditIndex
          userId={this.props.userId}
          tripRef={this.props.tripRef}
          tripId={this.props.tripId}
        />

        {(buddyId === this.props.userId)
          ? <button className="btn">Edit</button>}
        ? */

/* render() {
    return (
      <div className="well well-lg">
          <div>
            <ul >
              {Object.keys(this.state.buddies).map((buddyId, index) => {
                //               console.log('*********IN BUDDIES RENDER********:', buddyId)
                return (buddyId === this.props.userId) ?
                  <li key={index} className='trip-buddies'>
                    <InlineBuddyEditIndex
                      userId={this.props.userId}
                      tripRef={this.props.tripRef}
                      tripId={this.props.tripId}
                    />

                  </li> : <li key={buddyId} className='trip-buddies'>
                    <div className='buddiesListItem'>Name: {this.state.buddies[buddyId].name}</div>
                    <div className='buddiesListItem'>Home Base: {this.state.buddies[buddyId].homeBase}</div>
                    <div className='buddiesListItem' >Status: {this.state.buddies[buddyId].status.text}</div>
                    <div className='buddiesListItem'>Free from: {(this.state.buddies[buddyId].startDate) ? this.state.buddies[buddyId].startDate.slice(0, 10) : 'TBD'}</div>
                    <div className='buddiesListItem'>Free until: {(this.state.buddies[buddyId].endDate) ? this.state.buddies[buddyId].endDate.slice(0, 10) : 'TBD'}</div>
                  </li>
              }
              )}
            </ul>
          </div>
          <div>
            <button style={{
              color: '#18bc9c',
              backgroundColor: '#ffffff',
              borderRadius: '5px',
              padding: '1px 6px'
            }}
              type="button"
              onClick={() =>
                document.getElementById('addBuddyModal').style.display = 'block'}
            >Add Buddy!</button>
          </div>
          <div className="modal" id="addBuddyModal">
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close"
                    onClick={() =>
                      document.getElementById('addBuddyModal').style.display = 'none'}
                  >&times;
                    </button>
                  <h4 className="modal-title">Follow these steps:</h4>
                </div>
                <div className="modal-body">
                  <p> Step 1: Enter your buddy's e-mail here: </p>
                  <input type="text" id="newBuddyEmail"></input>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.makeNewBuddy}
                  >Add a buddy! </button>
                </div>
                <div className="modal-footer"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around'
                  }}>
                  <p>Step 2: Share this link with your buddy: </p>
                  <br />
                  <p>{`https://tern-2b37d.firebaseapp.com${window.location.pathname}`}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        )
  }
} */
