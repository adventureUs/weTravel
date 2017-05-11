import React, { Component } from 'react'
import { RIEToggle, RIEInput, RIETextArea, REINumber, RIETags, RIESelect } from 'riek'
import { Route } from 'react-router'
import firebase from 'APP/fire'

const db = firebase.database()

export default class AddIdea extends Component {
  constructor(props) {
    super(props)
    // in the future instead of e-mail add an additional field for preferred contact info
    // set scope on OAuth request and include phone number
    // We currently handle a case for new signup.
    // We need to consider the case for when someone is logged in aand has info in the database. In this case, we want to get their
    // details from the database if they exist and if they don't exist, give the prompts.
    // some ternary like: if there is a logged in user and they have a name in the db, return the name. Otherwise return 'plase enter a name'.
    // same double condition needed for homeBase: if user logged in AND user has a homebase, grab it from the db and put it on initial state, otherwise ....

    // the goal here is to put buddy info from the buddies key from tripRef on state and keep aligned with the homebase on userRef

    this.state = {
      ideaName: 'Please enter idea name here',
      link: '',
      status: { id: '1', text: 'Invited' },
      category: [
        { id: '1', text: 'Food' },
        { id: '2', text: 'Activity' },
        { id: '3', text: 'Accomodation' },
        { id: '4', text: 'Miscellaneous' }
      ]
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    // When we unmount, stop listening.
    this.unsubscribe()
  }

  componentWillReceiveProps(incoming, outgoing) {
  }

// not used for the moment
  listenTo(ref) {
    if (this.unsubscribe) this.unsubscribe()
    const listener = ref.on('value', snapshot => {
      // console.log('SNAPSHOT VAL', snapshot.val())
      this.setState(snapshot.val())
    })
    this.unsubscribe = () => ref.off('value', listener)
    return listener
  }

  setLocalState = (newState) => {
    this.setState(newState)
    // this.updateDb()
  }

  postIdeaToDB = (e) => {
    e.preventDefault()
    console.log('FROM POST IDEA TO DB ideasRef', this.props.ideasRef)
    this.props.ideasRef
      .update({
        ideaName: this.state.ideaName || 'Please enter idea name',
        link: this.state.link || 'Please enter url',
        category: this.state.category || { id: '4', text: 'Miscellaneous' },
      })
  }

  validateField = (field) => {
    if (!field) window.alert('Please enter a value.')
    else {
      this.setState({
        [field]: field
      })
    }
  }

  render() {
    console.log('Add Idea props', this.props)
    return (
      <form onSubmit={this.postIdeaToDB}>
        <div className="container">
          <div className="form-horizontal">
            <div className="col-md-3">
              <span>Idea Name: </span>
              <RIEInput
                value={this.state.ideaName}
                change={this.setLocalState}
                propName="ideaName"
                className={this.state.highlight ? 'editable': ''}
                validate={this.isStringAcceptable}
                classLoading="loading"
                classInvalid="Invalid" />
            </div>
            <div className="col-md-3">
              <span>Category: </span>
              <RIESelect
                value={this.state.category}
                className={this.state.highlight ? 'editable' : ''}
                options={this.state.categoryOptions}
                change={this.setLocalState}
                classLoading="loading"
                propName="status" />
            </div>
            <div className="col-md-3">
              <span>Link: </span>
              <RIEInput
                value={this.state.link}
                change={this.setLocalState}
                propName="link"
                className={this.state.highlight ? 'editable' : ''}
                validate={this.isStringAcceptable}
                classLoading="loading"
                classInvalid="Invalid" />
            </div>
          </div>
        </div>
        <button>Save Info</button>
      </form>
    )
  }
}
