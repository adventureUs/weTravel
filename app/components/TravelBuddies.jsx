import React, { Component } from 'react'
import {Route} from 'react-router'
import DatePicker from 'react-datepicker'

import moment from 'moment'
import firebase from 'APP/fire'
const db = firebase.database

export default class TravelBuddies extends Component {
  constructor() {
    super()
    this.state = {
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
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>HomeBase</th>
                <th>Available Dates</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input name="name" type="text" className="form-control" placeholder="Name" />
                </td>
                <td>
                  <input readOnly name="email" type="email" className="form-control" placeholder="Email from db Goes here" />
                </td>
                <td>
                  <select className="col-xs-2">status
                      <option>Invited</option>
                      <option>Going</option>
                      <option>Can't Make It</option>
                  </select>
                </td>
                <td>
                  <input name="homebase" type="text" className="form-control" placeholder="Home Base"/>
                </td>
                <td>
                  <DatePicker
                        selected={this.state.startDate}
                        selectsStart
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onChange={this.handleChangeStart}
                    />
                </td>
                <td>
                  <DatePicker
                        selected={this.state.endDate}
                        selectsEnd
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        onChange={this.handleChangeEnd}
                    />
                </td>
                <td>
                  <button onClick={this.showDate}>Dummy Log Dates Button</button>
                </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
