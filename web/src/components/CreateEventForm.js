import axios from 'axios';
import DatePicker from 'material-ui/DatePicker';
import Promise from 'bluebird';
import { Card, MenuItem, RaisedButton, SelectField, TextField } from 'material-ui';
import React, { Component } from 'react';
import TimePicker from 'material-ui/TimePicker';

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
      return axios.post('/api/createEvent', this.state);
    })
    .then((data) => {
      let newMarker = {
        position: {lat: Number(data.data.lat), lng: Number(data.data.lng)},
        defaultAnimation: 3,
        key: Math.random(),
      };
      this.props.markers.push(newMarker);
      this.props.updateForm(this.state);
      this.props.setMarkers(this.props.markers);
      this.props.changeCenter({lat: Number(data.data.lat), lng: Number(data.data.lng)});
    })
    .then(() => {
      axios.get('/api/retrieveEvents')
      .then((data) => {
        this.props.addEvents(data.data);
      });
    })
    .catch(err => { console.log('error in submitting event', err); });
  }

  render() {
    return (
      <Card className="createEventForm" style={styles.container}>
        <TextField
          style={styles.textField}
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

const styles = {
  container: {
    paddingTop: 0,
    paddingLeft: 30,
    paddingBottom: 30,
  },
  textField: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  }
};

export default CreateEventForm;
