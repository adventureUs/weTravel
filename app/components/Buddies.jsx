import React from 'react'
import firebase from 'APP/fire'
import InlineBuddyEditIndex from './InlineBuddyEditIndex'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      buddies: {}
    }
  }
  componentWillMount() {
    // we want to loop over the buddies in the current trip and have them render out in the list of items.
    // We need to check if the user we're looping over is the current user, if so, pass them through to InlineBuddyEditIndex
  }
  componentWillReceiveProps(incoming, outgoing) {
    // When the props sent to us by our parent component change,
    // start listening to the new firebase reference.
    // console.log('FROM RECEIVE PROPS', incoming)
    this.listenTo(incoming.tripRef.child('/buddies'))
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
    return listener
  }

  makeNewBuddy = () => {
    const newBuddyEmail = document.getElementById('newBuddyEmail').value
    var hasPendingBuddies = this.props.tripRef
      .once('value')
      .then(snapshot => {
        snapshot.child('pendingBuddies').exists()
      })

    if (hasPendingBuddies) {
      this.props.tripRef.child('pendingBuddies').push({
        // this creates a uid for each pending buddy
        // the uid is a key, the value is {email: newBuddyEmail}
        email: newBuddyEmail
      })
    } else {
      this.props.tripRef
        .update({
          // this creates a uid for each pending buddy
          // the uid is a key, the value is {email: newBuddyEmail}
          pendingBuddies: {
            email: newBuddyEmail
          }
        })
    }
  }

  render() {
    return (
      <div className="well well-lg">
        <div>
          <ul >
            {Object.keys(this.state.buddies).map((key) => {
              return (key === this.props.userId) ?
                <li key={key} className='trip-buddies'>
                  <InlineBuddyEditIndex
                    userId={this.props.userId}
                    tripRef={this.props.tripRef}
                    tripId={this.props.tripId}
                  />
                </li> : <li key={key} className='trip-buddies'>
                  <div className='buddiesListItem'>Name: {this.state.buddies[key].name}</div>
                  <div className='buddiesListItem'>Home Base: {this.state.buddies[key].homeBase}</div>
                  <div className='buddiesListItem' >Status: {this.state.buddies[key].status.text}</div>
                  <div className='buddiesListItem'>Free from: {this.state.buddies[key].startDate.slice(0, 10)}</div>
                  <div className='buddiesListItem'>Free until: {this.state.buddies[key].endDate.slice(0, 10)}</div>
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
}


