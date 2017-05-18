import React, { Component } from 'react'
import SetClass from 'react-classset'
import firebase from 'APP/fire'
import InlineBuddyEditIndex from './InlineBuddyEditIndex'
import moment from 'moment'
import CopyToClipboard from 'react-copy-to-clipboard'

export default class AddBuddyModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pendingBuddies: null,
      clipboard: `https://tern-2b37d.firebaseapp.com${window.location.pathname}`,
      copied: ''
    }
    this.closeModal = this.closeModal.bind(this)
  }
  componentDidMount() {
    this.listenTo(this.props.tripRef.child('pendingBuddies'))
  }
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }
  componentWillReceiveProps(incoming, outgoing) {
    this.listenTo(incoming.tripRef.child('pendingBuddies'))
  }
  listenTo(ref) {
    if (this.unsubscribe) this.unsubscribe()
    const listener = ref.on('value', snapshot => {
      const pendingBuddies = snapshot.val()
      /* Edge case Question, by Stef: say all pending buddies are removed
      what will be the state of snapshot and pendingBuddies in db?
      And, do we need to guard against that empty truthy obj below?
      I think it would result in an okish empty render. */
      snapshot && pendingBuddies ?
        this.setState({ pendingBuddies: pendingBuddies })
        :
        this.setState({ pendingBuddies: 'You have no pending buddies' })
    })
    this.unsubscribe = () => ref.off('value', listener)
  }
  closeModal(e) {
    // console.log('Add buddy modal xOut click', e)
    document.getElementById('addBuddyModal').style.display = 'none'
  }
  makeNewBuddy = () => {
    const newBuddyEmail = this.refs.buddyEmail.value
    console.log('new email', newBuddyEmail)
    var newPostKey = this.props.tripRef.child('pendingBuddies').push().key
    var buddyUpdate = {}
    buddyUpdate[newPostKey] = {
      email: newBuddyEmail
    }
    this.props.tripRef.child('pendingBuddies').update(buddyUpdate)
    this.refs.buddyEmail.value = ''
  }

  render() {
    return this.state.pendingBuddies ? (
      <div className="modal" id="addBuddyModal">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close"
                onClick={this.closeModal}
              >&times;
                  </button>
              <h4 className="modal-title">Add a Buddy</h4>
            </div>
            {
              typeof this.state.pendingBuddies === 'string' ?
                <div className='modal-header'>
                  <h5>{this.state.pendingBuddies}</h5>
                </div>
                :
                <div className='modal-header'>
                  <h5> These buddies have been added but haven't joined the trip: </h5>
                  <ul id='pending-buddies-list'>
                    {typeof this.state.pendingBuddies === 'string' ?
                      <div>{this.state.pendingBuddies}</div>
                      :
                      Object.keys(this.state.pendingBuddies)
                        .map(pendingId => <li key={pendingId}>{
                          this.state.pendingBuddies[pendingId] &&
                          this.state.pendingBuddies[pendingId].email
                        }</li>)
                    }
                  </ul>
                </div>
            }
            <div className="modal-body">
              <h4 className="modal-title">Follow these steps:</h4>
              <span
                style={{
                  fontWeight: 'bold'
                }}>
                Step 1: </span>
              <span> Enter your buddy's e-mail here: </span>
              <div className="modal-add-buddy">
                <input
                  ref="buddyEmail"
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
              {this.state.copied ? <div><p style={{ color: '#18bc9c', padding: '5px' }}>Copied.</p></div> : null}
            </div>
          </div>
        </div>
      </div>
    ) :
      null
  }
}
