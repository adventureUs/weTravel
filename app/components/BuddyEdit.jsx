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
            <div className="col-md-3">
              <input name="name" type="text" className="form-control" placeholder="Name" />
            </div>
            <div className="col-md-3">
              <input readOnly="true" name="email" type="email" className="form-control  col-md-3" placeholder="Email from db Goes here" />
            </div>
            <div className="col-md-3">
              <select className="col-md-3">status
                  <option>Invited</option>
                  <option>Going</option>
                  <option>Can't Make It</option>
              </select>
            </div>
            <div className="col-md-3">            
              <input name="homebase" type="text" className="form-control  col-md-3" placeholder="Home Base"/>
            </div>
            <div className="col-md-3">            
              <DatePicker
                  selected={this.state.startDate}
                  selectsStart
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={this.handleChangeStart}
              />
            </div>
            <div className="col-md-3">
              <DatePicker
                  selected={this.state.endDate}
                  selectsEnd
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={this.handleChangeEnd}
              />
            </div>
            <button onClick={this.showDate}>Dummy Log Dates Button</button>
          </form>
        </div>
      </div>
    )
  }
}
