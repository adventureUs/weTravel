import React from 'react'
import { Link } from 'react-router'
import firebase from 'APP/fire'

import idToNameOrEmail from '../../src/idToNameOrEmail'

const auth = firebase.auth()

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userChatHandle: '',
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
    idToNameOrEmail(this.props.userId)
      .then(user => this.setState({ userChatHandle: user }))
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
    this.props.tripRef.update({ chat: [] })
    const chatRef = this.props.tripRef.child('chatLog')
    console.log('Check out my path!', chatRef)

    idToNameOrEmail(this.props.userId)
      .then(user => {
        chatRef.push({
          message: this.state.currChat,
          user: user
        })
          .then(() => chatRef.on('value', function (snapshot) {
            // loops through chats in database
            snapshot.forEach(function (childSnapshot) {
              // console.log('PREVCHATS', prevChats)
              prevChats.push(childSnapshot.val())
            })
          }, function (error) {
            console.log('Error: ' + error.code)
          }))
          .then(() => this.setState({ currChat: '', prevChats: prevChats }))
          .catch(err => console.error(err))
      })
  }

  render() {
    console.log('STATE', this.state)
    return (
      <div className="chat">
        <form className="form" >
          <section>
            {this.state.prevChats.map((chat, i) =>
              ( // add logic about from whom the chat is
                chat.user === this.state.userChatHandle
                  ?
                  <div key={i}
                    className="from-me">
                    <p >
                      {`${chat.user}:  ${chat.message}`}
                    </p>
                  </div>
                  :
                  <div key={i}
                    className="from-them">
                    <p >
                      {`${chat.user}:  ${chat.message}`}
                    </p>
                  </div>
              )
            )}
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
          </section>
        </form>
      </div>
    )
  }
}
