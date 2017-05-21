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
  }

  componentWillReceiveProps(incoming) {
    this.listenTo(incoming.tripRef.child('/chatLog'))
    if (incoming.userId) {
      idToNameOrEmail(incoming.userId)
        .then(user => this.setState({ userChatHandle: user }))
    }
  }

  componentWillMount() {
    if (this.props.userId) {
      idToNameOrEmail(this.props.userId)
        .then(user => this.setState({ userChatHandle: user }))
    }
  }

  componentDidMount() {
    const chatLogExists = this.props.tripRef
      .once('value')
      .then(snapshot => snapshot.hasChild('chatLog'))
    if (!chatLogExists) this.props.tripRef.update({ chatLog: [] })
    const chatRef = this.props.tripRef.child('chatLog')
    this.listenTo(chatRef)
  }

  listenTo(ref) {
    if (this.unsubscribe) this.unsubscribe()
    const listener = ref.on('value', snapshot => {
      this.setState({ prevChats: snapshot.val() }, this.updateScroll())
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

  handleChat = (e) => {
    e.preventDefault()
    const chatRef = this.props.tripRef.child('chatLog')
    idToNameOrEmail(this.props.userId)
      .then(user => {
        chatRef.push({
          message: this.state.currMessage,
          user: user
        })
      })
      .catch(err => console.error(err))
    this.refs.input.value = ''
    this.updateScroll()
  }

  updateScroll = () => {
    var chatLog = document.getElementById('chat-log')
    chatLog.scrollTop = chatLog.scrollHeight
  }

  render() {
    return (
      <div className='chat-outer-container col col-md-3'>
        <div className="chat-container">
          <div id="chat-title">Discussion board</div>
          <section id="chat-log">
            {Object.keys(this.state.prevChats || {}).map((chat, index) => {
              return ( // add logic about from whom the chat is
                this.state.prevChats[chat].user === this.state.userChatHandle
                  ?
                  <div key={index}>
                    <div className="from-me">
                    {`${this.state.prevChats[chat].message}`}
                    </div>
                  </div>
                  :
                  <div key={index}>
                    {`${this.state.prevChats[chat].user}:`}
                    <br/>
                    <div className="from-them">
                      {`${this.state.prevChats[chat].message}`}
                      </div>
                  </div>
              )
            }
            )}
          </section>
        </div>
        <form className="form" >
          <div id="chatInput"
               className="form-group">
            <div id="messageInput">
              <input
                ref="input"
                type="text"
                className="form-control"
                id="chat"
                placeholder={'Type a message...'}
                onChange={this.onChange}
              />
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
