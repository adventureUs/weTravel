import React from 'react'
import {Link} from 'react-router'
import firebase from 'APP/fire'

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
    const prevChats=[]
    const chatRef = firebase.database().ref('chat')

    chatRef.on('value', function(snapshot) {
      // loops through chats in database
      snapshot.forEach(function(childSnapshot) {
        console.log('PREVCHATS ***', prevChats)
        prevChats.push(childSnapshot.val())
      })
      .then(() => this.setState({currChat: '', prevChats: prevChats}))
    }, function(error) {
      console.log('Error: ' + error.code)
    })
  }

  handleInput = (e) => {
    this.setState({
      currChat: e.target.value
    })
  }

  handleChat = e => {
    e.preventDefault()
    const prevChats=[]
    const chatRef = firebase.database().ref('chat')

    chatRef.push({
      chat: this.state.currChat,
      user: auth.currentUser.email
    })
    .then(() => chatRef.on('value', function(snapshot) {
      // loops through chats in database
      snapshot.forEach(function(childSnapshot) {
        console.log('PREVCHATS', prevChats)
        prevChats.push(childSnapshot.val())
      })
    }, function(error) {
      console.log('Error: ' + error.code)
    }))
    .then(() => this.setState({currChat: '', prevChats: prevChats}))
    .catch(err => console.error(err))
  }

  render() {
    return (
    <div className="row">
     <div className = "col-lg-3" >
      <form className="form" >
        <table>
          <thead></thead>
          <tbody>
            {this.state.prevChats.map((chat, i) =>
             (
             <tr key={i} >
              <div className="scroll">
                <td className="well well-sm" >
                  {`${chat.user}:  ${chat.chat}`}
                </td>
              </div>
             </tr>
             )
           )}
          </tbody>
        </table>
        <input type="text"
                className="form-control"
                id="chat"
                onChange={ this.handleInput } />
        <button className="btn btn-primary"
                onClick={ this.handleChat } >
                chat
        </button>
      </form>
      </div>
    </div>
    )
  }
}
