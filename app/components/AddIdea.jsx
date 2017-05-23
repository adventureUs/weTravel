import React, { Component } from 'react'
import { RIEToggle, RIEInput, RIETextArea, REINumber, RIETags, RIESelect } from 'riek'
import { Route } from 'react-router'
import DatePicker from 'react-datepicker'
import moment from 'moment'
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

    this.state = this.defaultState
  }
  defaultState = {
    ideaName: 'Enter name here',
    link: 'Enter a url',
    status: { id: '1', text: 'Invited' },
    categoryOptions: [
      { id: '1', text: 'Food' },
      { id: '2', text: 'Activity' },
      { id: '3', text: 'Accomodation' },
      { id: '4', text: 'Miscellaneous' }
    ],
    category: { id: '4', text: 'Miscellaneous' },
    startDate: '', // Used for Date Picker
    endDate: '' // Not used for mvp
  }
  componentDidMount() {
    this.setState({
      state: this.defaultState
    })
  }
  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  componentWillReceiveProps(incoming, outgoing) {
    this.listenTo(incoming.ideasRef || 'test')
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
    if (newState.link) {
      const http = newState.link.slice(0, 7)
      const https = newState.link.slice(0, 8)
      if (http !== 'http://' && https !== 'https://') {
        newState.link = 'https://' + newState.link
      } 
    }
  }

  postIdeaToDB = (e) => {
    e.preventDefault()
    const endDate = this.calculateDefaultDuration()
    // console.log('ADDIDEA', 'POSTING TO DB', 'start and end', this.state.startDate, endDate)
    this.props.ideasRef
      .push({
        ideaName: this.state.ideaName || 'Please enter idea name',
        link: this.state.link || 'Please enter a url',
        category: this.state.category || { id: '4', text: 'Miscellaneous' },
        addedBy: this.props.userId,
        likes: 0,
        startDate: this.state.startDate.toJSON() || moment().toJSON(),
        endDate: endDate.toJSON()
      })
    this.setState(this.defaultState)
  }
  calculateDefaultDuration() {
    let hours = 0
    // switch (this.state.category.id) {
    // case '1': // Food
    //   this.state.startDate.add(12, 'hours')
    //   // hours = 1
    //   hours = 4
    //   break
    // case '2': // Activity
    //   this.state.startDate.add(14, 'hours')
    //   // hours = 4
    //   hours = 6
    //   break
    // case '3': // Accomodation
    //   this.state.startDate.add(18, 'hours')
    //   // hours = 12
    //   hours = 24
    //   break
    // case '4': // Miscellaneous
    //   this.state.startDate.add(10, 'hours')
    //   // hours = 2
    //   hours = 12
    //   break
    // default:  // Default in case we messed up
    //   // hours = 1
    //   hours = 12
    // }
    hours = 24
    return this.state.startDate ?
      moment(this.state.startDate).add(hours, 'hours') :
      moment()
  }

  validateField = (field) => {
    if (!field) window.alert('Please enter a value.')
    else {
      this.setState({
        [field]: field
      })
    }
  }
  // Note: this handleChangeStart is bound to AddIdea.
  handleChangeStart = (startDate) => {
    this.setState({
      startDate: startDate
    })
  }

  render() {
    // console.log('ADDIDEA', 'RENDER', 'STATE', this.state)
    return (
        <div className='addIdea'>

      <form onSubmit={this.postIdeaToDB}>
        <div className="container">
          <div className="form-horizontal row"
            style={{ display: 'flex',
              alignItems: 'center'}}>
            <div className="col-md-3">
              <label>New Idea: </label>
              <div style={{ color: 'lightSlateGray' }} >
                <RIEInput
                  value={this.state.ideaName}
                  change={this.setLocalState}
                  propName="ideaName"
                  className={this.state.highlight ? 'editable': ''}
                  validate={this.isStringAcceptable}
                  classLoading="loading"
                  classInvalid="Invalid"
                  />
              </div>
            </div>
            <div className="col-md-3">
              <label>Link: </label>
              <div style={{ color: 'lightSlateGray' }} >
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
            <div className="col-md-3">
              <label>Category: </label>
              <div style={{ color: 'lightSlateGray' }} >
                <RIESelect
                  value={this.state.category}
                  className={this.state.highlight ? 'editable' : ''}
                  options={this.state.categoryOptions}
                  change={this.setLocalState}
                  classLoading="loading"
                  propName="category" />
              </div>
            </div>
            <div className="col-md-3">
              <span>Date: </span>
              <DatePicker
                selected={this.state.startDate ? moment(this.state.startDate) : null}
                onChange={this.handleChangeStart}
              />
            </div>
            <div className="col-md-3">
              <button style={{
                color: '#18bc9c',
                backgroundColor: '#ffffff',
                borderRadius: '5px',
                padding: '1px 6px'
              }}>Submit</button>
            </div>
          </div>
        </div>
      </form>
      </div>
    )
  }
}
