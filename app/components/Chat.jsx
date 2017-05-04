import React from 'react'
import {Link} from 'react-router'
import firebase from 'APP/fire'

const auth = firebase.auth()

export default class extends React.Component {
  render() {
    <div class="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title">Chat Box</h4>
          </div>
          <div class="modal-body">
            <p>Chatting....</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary">Submit</button>
          </div>
        </div>
      </div>
    </div>
  }
}
