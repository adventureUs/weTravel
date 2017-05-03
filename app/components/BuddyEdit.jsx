import React, { Component } from 'react'
import {Route} from 'react-router'
import DatePicker from 'react-datepicker'

import moment from 'moment'
import firebase from 'APP/fire'
const db = firebase.database

export default class BuddyEdit extends Component {
  constructor() {
    super()
    this.state = {
      name:'',
      status:'',
      homeBase:'',
      startDate: moment(),
      endDate: moment()
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleChangeStart = this.handleChangeStart.bind(this)
    this.handleChangeEnd = this.handleChangeEnd.bind(this)
    this.showDate = this.showDate.bind(this)
  }

  handleChange = e => {
    console.log('TravelBuddies on Change', e.target.name, e.target.value)
  }


  handleChangeStart = m => {
    this.setState({startDate: m})
    console.log('TravelBuddies Start Date On Change', this.state.startDate.format('MMM Do YY'))
  }

  handleChangeEnd = m => {
    this.setState({endDate: m})
    console.log('TravelBuddies End Date On Change', this.state)
  }
  showDate = (e) => {
    e.preventDefault()
    console.log(this.state)
  }

  render() {
    return (
      <div>
        <h1>BUDDIES</h1>
        <div className="container">
          <form className="form-horizontal">
            <input name="name" type="text" className="form-control" placeholder="Name" />
            <input readonly name="email" type="email" className="form-control" placeholder="Email from db Goes here" />
            <select className="col-xs-2">status
                <option>Invited</option>
                <option>Going</option>
                <option>Can't Make It</option>
            </select>
            <input name="homebase" type="text" className="form-control" placeholder="Home Base"/>
            <DatePicker
                  selected={this.state.startDate}
                  selectsStart
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={this.handleChangeStart}
              />
            <DatePicker
                  selected={this.state.endDate}
                  selectsEnd
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={this.handleChangeEnd}
              />
            <button onClick={this.showDate}>Dummy Log Dates Button</button>
          </form>
        </div>
      </div>
    )
  }
}
