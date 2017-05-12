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
      currMessage: 'Type a message...',
      prevChats: {}
    }

    this.onChange = this.onChange.bind(this)
    this.handleChat = this.handleChat.bind(this)
  }

  componentDidMount() {
    const chatLogExists = this.props.tripRef
      .once('value')
      .then(snapshot => snapshot.hasChild('chatLog'))
    if (!chatLogExists) this.props.tripRef.update({ chatLog: [] })
    const chatRef = this.props.tripRef.child('chatLog')
    this.listenTo(chatRef)
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
    //   .then(() => this.setState({currMessage: '', prevChats: prevChats}))
    // }, function(error) {
    //   console.log('Error: ' + error.code)
    // })
    if (this.props.userId) idToNameOrEmail(this.props.userId)
      .then(user => this.setState({ userChatHandle: user }))
  }

  componentWillReceiveProps(incoming) {
    this.listenTo(incoming.tripRef.child('/chatLog'))
  }

  listenTo(ref) {
    if (this.unsubscribe) this.unsubscribe()

    const listener = ref.on('value', snapshot => {
      // console.log('IN LISTEN TO SHOULD BE PREV CHATS', snapshot.val())
      this.setState({ prevChats: snapshot.val() })
    })

    this.unsubscribe = () => ref.off('value', listener)
    return listener
  }

  componentWillUnmount() {
   this.unsubscribe && this.unsubscribe()
  }

  onChange = (e) => {
    this.setState({
      currMessage: e.target.value
    })
  }

  handleFocus = (el) => {
    if (el.value === 'Type a message...') {
      console.log('SHOULD CLEAR?')
      el.value = ''
    }
  }

  // Notes from Ashi
  // Remove lines 50-60
  // dont use prevChats constant
  // use the listener and update state at the same time
  handleChat = e => {
    e.preventDefault()
    // this.props.tripRef.update({ chatLog: [] })
    const chatRef = this.props.tripRef.child('chatLog')

    idToNameOrEmail(this.props.userId)
      .then(user => {
        chatRef.push({
          message: this.state.currMessage,
          user: user
        })
      })
      .catch(err => console.error(err))
  }
  // handleChat = e => {
  //   e.preventDefault()
  //   const prevChats = []
  //   this.props.tripRef.update({ chatLog: [] })
  //   const chatRef = this.props.tripRef.child('chatLog')
  //   console.log('Check out my path!', chatRef)

  //   idToNameOrEmail(this.props.userId)
  //     .then(user => {
  //       chatRef.push({
  //         message: this.state.currMessage,
  //         user: user
  //       })
  //         .then(() => chatRef.on('value', function (snapshot) {
  //           // loops through chats in database
  //           snapshot.forEach(function (childSnapshot) {
  //             // console.log('PREVCHATS', prevChats)
  //             prevChats.push(childSnapshot.val())
  //           })
  //         }, function (error) {
  //           console.log('Error: ' + error.code)
  //         }))
  //         .then(() => this.setState({ currMessage: '', prevChats: prevChats }))
  //         .catch(err => console.error(err))
  //     })
  // }

  render() {
    return (
      <div >
        <form className="form" >
          <section className="chat">
            {Object.keys(this.state.prevChats || {}).map((chat, index) => {
              console.log('CHAT', this.state.prevChats[chat])
              return ( // add logic about from whom the chat is
                this.state.prevChats[chat].user === this.state.userChatHandle
                  ?
                  <div key={index}
                    className="from-me">
                    <p >{`${this.state.prevChats[chat].message}`}</p>
                  </div>
                  :
                  <div key={index}
                    className="from-them">
                    <p className="chatName"> {`${this.state.prevChats[chat].user}:`}</p>
                    <p> {`${this.state.prevChats[chat].message}`}</p>
                  </div>
              )
            }

            )}
          </section>
          <div id="chatInput" className="form-group">
            <div id="messageInput">
              <input type="text"
                className="form-control"
                id="chat"
                value={this.state.currMessage}
                onChange={this.onChange}
                onFocus={this.handleFocus} />
            </div>
            <div id="submitMessage">
              <button className="btn btn-primary"
                onClick={this.handleChat} >
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
