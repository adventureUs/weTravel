import React from 'react'
import { Link } from 'react-router'
import firebase from 'APP/fire'

import idToNameOrEmail from '../../src/idToNameOrEmail'

const auth = firebase.auth()

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currChat: '',
      prevChats: []
    }

    this.handleInput = this.handleInput.bind(this)
    this.handleChat = this.handleChat.bind(this)
  }

  componentWillMount() {
    // const prevChats=[]
    // const chatRef = firebase.database().ref('chat')

    // chatRef.on('value', function(snapshot) {
    //   // loops through chats in database
    //   snapshot.forEach(function(childSnapshot) {
    //     console.log('PREVCHATS ***', prevChats)
    //     prevChats.push(childSnapshot.val())
    //   })
    //   .then(() => this.setState({currChat: '', prevChats: prevChats}))
    // }, function(error) {
    //   console.log('Error: ' + error.code)
    // })
  }

  handleInput = (e) => {
    this.setState({
      currChat: e.target.value
    })
  }
  // Notes from Ashi
  // Remove lines 50-60
  // dont use prevChats constant
  // use the listener and update state at the same time

  handleChat = e => {
    e.preventDefault()
    const prevChats = []
    this.props.tripRef.update({chat: []})
    const chatRef = this.props.tripRef.child('chatLog')
    console.log('Check out my path!', chatRef)

    idToNameOrEmail(this.props.userId)
      .then(user => {
        chatRef.push({
          message: this.state.currChat,
          user: user
        })
          .then(() => chatRef.on('value', function(snapshot) {
            // loops through chats in database
            snapshot.forEach(function(childSnapshot) {
              // console.log('PREVCHATS', prevChats)
              prevChats.push(childSnapshot.val())
            })
          }, function(error) {
            console.log('Error: ' + error.code)
          }))
          .then(() => this.setState({ currChat: '', prevChats: prevChats }))
          .catch(err => console.error(err))
      })
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-3" >
          <form className="form" >
            <table>
              <thead></thead>
              <tbody>
                {this.state.prevChats.map((chat, i) =>
                  (
                    <tr key={i}
                      className="well well-sm" >
                      <div className="scroll">
                        <td >
                          {`${chat.user}:  ${chat.message}`}
                        </td>
                      </div>
                      <hr />
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <div class="form-group">
              <input type="text"
                className="form-control"
                id="chat"
                onChange={this.handleInput} />
              <button className="btn btn-primary"
                onClick={this.handleChat} >
                chat
        </button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}
