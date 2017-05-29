import React, { Component } from 'react';
import Promise from 'bluebird';
import { RaisedButton, TextField, Card, SelectField, MenuItem } from 'material-ui';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import axios from 'axios';

class CreateEventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventName: '',
      date: null,
      time: null,
      location: '',
      description: '',
      category: 'select...',
      dateTime: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDatePicker = this.handleDatePicker.bind(this);
    this.handleTimePicker = this.handleTimePicker.bind(this);
  }

  handleChange(e) {
    let newState = {};
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  handleDatePicker(x, v) {
    this.setState({date: v});
  }

  handleTimePicker(x, v) {
    this.setState({time: v});
  }

  handleSelect(e) {
    this.setState({ category: e.target.innerHTML });
  }

  handleSubmit(e) {
    e.preventDefault();
    let date = this.state.date;
    let time = this.state.time;
    let dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
    return new Promise((resolve, reject) => {
      resolve(this.setState({ dateTime: dateTime }));
    })
    .then(() => {
      this.props.updateForm(this.state);
      return axios.get('/api/retrieveMarkers')
      .then((res) => {
        const nextMarkers = [];
        for (let i = 0; i < res.data.length; i++) {
          let newMarker = {
            position: {lat: Number(res.data[i].lat), lng: Number(res.data[i].lng)},
            defaultAnimation: 3,
            key: Math.random(),
          };
          nextMarkers.push(newMarker);
        }
        this.props.setMarkers(nextMarkers);
      })
      .catch((err) => {
        console.log(err);
      });
    })
    .catch(err => { console.log('error in submitting event', err); });
  }

  render() {
    return (
      <Card className="createEventForm" style={{ padding: 30 }}>
        <TextField
          name="eventName"
          floatingLabelText="Event Name"
          autoFocus
          value={this.state.eventName}
          onChange={this.handleChange}/>
        <br />
        <DatePicker
          name="date"
          autoOk={true}
          onChange={this.handleDatePicker}
          floatingLabelText="Date"/>
        <TimePicker
          name="time"
          autoOk={true}
          defaultTime={null}
          onChange={this.handleTimePicker}
          floatingLabelText="Time"/>
        <br />
        <TextField
          name="location"
          floatingLabelText="Location"
          value={this.state.location}
          onChange={this.handleChange}/>
        <br />
        <TextField
          name="description"
          floatingLabelText="Description"
          value={this.state.description}
          onChange={this.handleChange}/>
        <br />
        <SelectField floatingLabelText={this.state.category} >
          <MenuItem value="food" primaryText="Food" onTouchTap={this.handleSelect} />
          <MenuItem value="sports" primaryText="Sports" onTouchTap={this.handleSelect} />
          <MenuItem value="outdoors" primaryText="Outdoors" onTouchTap={this.handleSelect} />
          <MenuItem value="nightlife" primaryText="Nightlife" onTouchTap={this.handleSelect} />
          <MenuItem value="games" primaryText="Games" onTouchTap={this.handleSelect} />
          <MenuItem value="other" primaryText="Other" onTouchTap={this.handleSelect} />
        </SelectField>
        <br />
        <RaisedButton label="Create Event" secondary={true} onTouchTap={this.handleSubmit} />
      </Card>
    );
  }
}

export default CreateEventForm;
