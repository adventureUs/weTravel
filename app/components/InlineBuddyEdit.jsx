import React, { Component } from 'react'
import { RIEToggle, RIEInput, RIETextArea, REINumber, RIETags, RIESelect } from 'riek'
import {Route} from 'react-router'
import DatePicker from 'react-datepicker'
import WhoAmI from './WhoAmI'
import moment from 'moment'
import firebase from 'APP/fire'
const auth = firebase.auth()
const db = firebase.database()
const userRef = db.ref('users/')

export default class InlineBuddyEdit extends Component {
  constructor(props) {
    super(props)
    // const authInstance = props.route.auth
    console.log('AUTH', auth.currentUser)
    this.state = {
      name:'Please enter name here',
      email: authInstance.currentUser ? authInstance.currentUser.email : 'no email',
      status: {id: '1', text: 'Invited'},
      statusOptions: [
        {id: '1', text: 'Invited'},
        {id: '2', text: 'Going'},
        {id: '3', text: 'Can\'t make it'}
      ],
      homeBase:'New York',
      startDate: moment(),
      endDate: moment()
    }
  }

  virtualServerCallback = (newState) => {
    this.setState(newState)
    this.updateDb()
  }

  udpateDb = () => {
    const uid = auth.currentUser.uid
    console.log('UID', uid)
  }

  render() {
    return (
      <div>
      <WhoAmI auth={auth}/>
        <h1>BUDDIES</h1>
        <div className="container">
          <div className="form-horizontal">
            <div className="col-md-3">
            <span>Name: </span>
              <RIEInput
                value={this.state.name}
                change={this.virtualServerCallback}
                propName="name"
                className={this.state.highlight ? "editable" : ""}
                validate={this.isStringAcceptable}
                classLoading="loading"
                classInvalid="Invalid"/>
            </div>
            <div className="col-md-3">
            <span>Email: </span>
              <RIEInput
                value={this.state.email}
                change={this.virtualServerCallback}
                propName="email"
                className={this.state.highlight ? "editable" : ""}
                validate={this.isStringAcceptable}
                classLoading="loading"
                classInvalid="Invalid"/>
            </div>
            <div className="col-md-3">
            <span>Status: </span>
              <RIESelect
              value={this.state.status}
              className={this.state.highlight ? "editable" : ""}
              options={this.state.statusOptions}
              change={this.virtualServerCallback}
              classLoading="loading"
              propName="status" />
            </div>
            <div className="col-md-3">
            <span>Home Base: </span>
              <RIEInput
                value={this.state.homeBase}
                change={this.virtualServerCallback}
                propName="homeBase"
                className={this.state.highlight ? "editable" : ""}
                validate={this.isStringAcceptable}
                classLoading="loading"
                classInvalid="Invalid"/>
            </div>
            <div className="col-md-3">
            <span>Availability Start Date: </span>
              <DatePicker
                  selected={this.state.startDate}
                  selectsStart
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={this.handleChangeStart}
              />
            </div>
            <div className="col-md-3">
            <span>Availability End Date: </span>
              <DatePicker
                  selected={this.state.endDate}
                  selectsEnd
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={this.handleChangeEnd}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
