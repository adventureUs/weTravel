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
  }

  handleChange = e => console.log('TravelBuddies on Change', e.target.name, e.target.value)
  handleChangeStart = e => {
    console.log('TravelBuddies Start Date On Change', e.format('MMM Do YY'))
  }
  handleChangeEnd = e => console.log('TravelBuddies End Date On Change', e._d)

  render() {
    return (
      <div>
        <h1>BUDDIES</h1>
        <form id='location' className="form-horizontal">
              <fieldset>
                <legend>Buddies</legend>
                <div className="form-group well">
                  <div className="col-lg-4">
                    <ul>
                      <li>BUDDY NAME </li>
                    </ul>
                  </div>
                  <div className="col-lg-4">
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
                  </div>
                  <div className="col-lg-4">
                    <DatePicker id="dateMin" name="dateMin" />
                    <DatePicker id="dateMax" name="dateMax" />
                    <div id="dateSlider"></div>
                    <span id="output"></span>
                  </div>
                </div>
              </fieldset>
            </form>
      </div>
    )
  }
}
