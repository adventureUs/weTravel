import React from 'react'
import SetClass from 'react-classset'
import CopyToClipboard from 'react-copy-to-clipboard'
import moment from 'moment'
import firebase from 'APP/fire'
import AddBuddyModal from './AddBuddyModal'
import idToNameOrEmail from '../../src/idToNameOrEmail'
import InlineBuddyEditIndex from './InlineBuddyEditIndex'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      buddies: null, // there's nothing on state when we go to the buddies tab
      clipboard: `https://tern-2b37d.firebaseapp.com${window.location.pathname}`,
      copied: '',
    }
  }
  componentDidMount() {
    this.listenTo(this.props.tripRef.child('buddies'))
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }
  componentWillReceiveProps(incoming, outgoing) {
    // When the props sent to us by our parent component change,
    // start listening to the new firebase reference.
    this.listenTo(incoming.tripRef.child('buddies')) // this ref is undefined
    // this.listenTo(incoming.tripsRef.child(tripId))
  }
  listenTo(ref) {
    if (this.unsubscribe) this.unsubscribe()
    const listener = ref.on('value', snapshot => {
      var buddies = {}
      // for (var buddy in snapshot.val())
      // { buddies.push({[buddy]: snapshot.val()[buddy]}) }
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
      <tr key={buddyId}
          className='trip-buddies'>
        <td className={buddyClass}>
          {(buddyId === this.props.userId)
            ?
            <div>
              <span
                className='glyphicon glyphicon-pencil'
                onClick={() =>
                  document.getElementById('editYourInfoModal').style.display = 'block'}
              ></span>
            </div>

            : <div></div>
          }
        </td>
        <td className={buddyClass}>{this.state.buddies[buddyId].name || 'Please enter your name'}</td>
        <td className={buddyClass}> {this.state.buddies[buddyId].homeBase || 'Add your city here'}</td>
        <td className={buddyClass}> {this.state.buddies[buddyId].status.text}</td>
        <td className={buddyClass}>
          {(this.state.buddies[buddyId].startDate)
            ? this.state.buddies[buddyId].startDate.slice(0, 10)
            : 'TBD'}</td>
        <td className={buddyClass}>
          {(this.state.buddies[buddyId].endDate)
            ? this.state.buddies[buddyId].endDate.slice(0, 10)
            : 'TBD'}
        </td>
      </tr>
    )
  }
  
  render() {
    return (
      <div className='well'>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th></th>
              <th className="buddyHeader">Name</th>
              <th className="buddyHeader">Home Base</th>
              <th className="buddyHeader">Status</th>
              <th className="buddyHeader">Free From</th>
              <th className="buddyHeader">Free until</th>
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
          <button className="btn btn-primary"
            type="button"
            onClick={() =>
              document.getElementById('addBuddyModal').style.display = 'block'}
          >Add a Buddy!</button>
        </div>
        <div className="modal" id="add-buddy-modal">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button"
                        className="close"
                        onClick={() =>
                    document.getElementById('add-buddy-modal').style.display = 'none'}
                >&times;
                </button>
                <h4 className="modal-title">Follow these steps:</h4>
              </div>
              <div className="modal-body">
                <span
                  style={{
                    fontWeight: 'bold'
                  }}>
                  Step 1: </span>
                <span> Enter your buddy's e-mail here: </span>
                <div className="modal-add-buddy">
                  <input
                    ref="input"
                    className="modal-add-buddy-input form-control"
                    placeholder="Buddy's e-mail"
                    type="text"
                    id="newBuddyEmail" />
                  <button
                    className="modal-add-buddy-button"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.makeNewBuddy}
                  >Invite</button>
                </div>
                <span
                  style={{
                    fontWeight: 'bold'
                  }}>
                  Step 2: </span>
                <span> Share this link with your buddy: </span>
                <div className="modal-add-buddy">
                  <input
                    className="modal-add-buddy form-control"
                    style={{
                      fontSize: '11px'
                    }}
                    value={this.state.clipboard} />
                </div>

                <CopyToClipboard text={this.state.clipboard}
                  onCopy={() => this.setState({ copied: true })}>
                  <button
                    className="modal-add-buddy-button"
                    type="button"
                    className="btn btn-primary"
                    style={{
                      width: '100%'
                    }}
                  >Copy to clipboard</button>
                </CopyToClipboard>
                {this.state.copied
                  ? <div><p style={{ color: '#18bc9c', padding: '5px' }}>Copied.</p></div>
                  : null}
              </div>
            </div>
          </div>
        </div>
        <AddBuddyModal tripRef={this.props.tripRef}/>
        <div className="modal"
             id="editYourInfoModal">
          <div className="modal-dialog modal-md">
            <div className="modal-content">
              <div className="modal-header edit-buddy-header">
                <button type="button"
                        className="close"
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
