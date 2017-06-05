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
      <Card
        style={styles.container}
        containerStyle={styles.container}
      >
        <div>
          <TextField
            autoFocus
            floatingLabelText="Event Name"
            inputStyle={styles.text}
            name="eventName"
            onChange={this.handleChange}
            style={styles.textField}
            value={this.state.eventName}
          />
        </div>
        <div>
          <DatePicker
            autoOk={true}
            floatingLabelText="Date"
            inputStyle={styles.text}
            name="date"
            onChange={this.handleDatePicker}
          />
        </div>
        <div>
          <TimePicker
            autoOk={true}
            defaultTime={null}
            floatingLabelText="Time"
            inputStyle={styles.text}
            name="time"
            onChange={this.handleTimePicker}
          />
        </div>
        <div>
          <TextField
            floatingLabelText="Location"
            inputStyle={styles.text}
            name="location"
            onChange={this.handleChange}
            value={this.state.location}
          />
        </div>
        <div>
          <TextField
            floatingLabelText="Description"
            name="description"
            inputStyle={styles.text}
            onChange={this.handleChange}
            value={this.state.description}
          />
        </div>
        <div>
          <SelectField floatingLabelText={this.state.category}>
            <MenuItem value="food" primaryText="Food" onTouchTap={this.handleSelect} />
            <MenuItem value="sports" primaryText="Sports" onTouchTap={this.handleSelect} />
            <MenuItem value="outdoors" primaryText="Outdoors" onTouchTap={this.handleSelect} />
            <MenuItem value="nightlife" primaryText="Nightlife" onTouchTap={this.handleSelect} />
            <MenuItem value="games" primaryText="Games" onTouchTap={this.handleSelect} />
            <MenuItem value="other" primaryText="Other" onTouchTap={this.handleSelect} />
          </SelectField>
        </div>
        <div>
          <RaisedButton
            label="Create Event"
            labelStyle={styles.buttonLabel}
            labelColor={'#5E35B1'}
            onTouchTap={this.handleSubmit}
            style={styles.button}
          />
        </div>
      </Card>
    );
  }
}

const styles = {
  button: {
    border: '1px solid #5E35B1',
    borderRadius: '10px',
    backgroundColor: 'white',
    marginTop: '20px'
  },
  buttonLabel: {
    fontFamily: 'Vibur',
    fontSize: '18px',
    color: '#5E35B1',
    textTransform: 'capitalize',
  },
  container: {
    paddingTop: 0,
    paddingLeft: 30,
    paddingBottom: 30,
    height: '100%'
  },
  textField: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  text: {
    fontFamily: 'Vibur',
    fontSize: '18px',
  }
};

export default CreateEventForm;
