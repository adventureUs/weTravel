import React, { Component } from 'react'

export default class AddBuddyModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buddies: {}, // there's nothing on state when we go to the buddies tab
      clipboard: `https://tern-2b37d.firebaseapp.com${window.location.pathname}`,
      copied: ''
    }

  }
  render() {
    return(
           )
  }
}
