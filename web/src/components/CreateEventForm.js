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
      dateTime: null,
      eventNameError: null,
      dateError: null,
      timeError: null,
      locationError: null,
      categoryError: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDatePicker = this.handleDatePicker.bind(this);
    this.handleTimePicker = this.handleTimePicker.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  handleChange(e) {
    let newState = {};
    newState[e.target.name] = e.target.value;
    newState[e.target.name + 'Error'] = null;
    this.setState(newState);
  }

  handleDatePicker(x, v) {
    this.setState({date: v, dateError: null});
  }

  handleTimePicker(x, v) {
    this.setState({time: v, timeError: null});
  }

  handleSelect(e) {
    this.setState({ category: e.target.innerHTML, categoryError: null });
  }

  clearForm() {
    this.setState({
      eventName: '',
      date: null,
      time: null,
      location: '',
      description: '',
      category: 'select...',
      dateTime: null,
      eventNameError: null,
      dateError: null,
      timeError: null,
      locationError: null,
      categoryError: null,
    });
  }


  handleSubmit(e) {
    e.preventDefault();

    const errorCreator = (name, message) => {
      let e = new Error(message);
      e.name = name;
      return e;
    };

    return new Promise((resolve, reject) => {
      let date = this.state.date;
      let time = this.state.time;
      if (!this.state.eventName) { throw errorCreator('eventNameError', 'event name cannnot be empty'); }
      if (!date) { throw errorCreator('dateError', 'please select valid date'); }
      if (!time) { throw errorCreator('timeError', 'please select valid time'); }
      if (!this.state.location) { throw errorCreator('locationError', 'location cannnot be empty'); }
      if (this.state.category === 'select...') { throw errorCreator('categoryError', 'please select category'); }
      let dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
      resolve(this.setState({ dateTime: dateTime }));
    })
    .then(() => {
      return axios.post('/api/createEvent', this.state)
      .catch(err => { throw err.response.data; });
    })
    .then((data) => {
      this.props.updateForm(this.state);
      this.props.changeCenter({lat: Number(data.data.lat), lng: Number(data.data.lng)});
    })
    .then(() => {
      axios.get('/api/retrieveEvents')
      .then((data) => {
        this.props.addEvents(data.data);
        this.clearForm();
        alert('New event created!');
      });
    })
    .catch(err => {
      let newState = {};
      newState[err.name] = err.message;
      this.setState(newState);
    });
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
            errorText={this.state.eventNameError}
          />
        </div>
        <div>
          <DatePicker
            minDate={new Date()}
            autoOk={true}
            floatingLabelText="Date"
            inputStyle={styles.text}
            name="date"
            value={this.state.date}
            onChange={this.handleDatePicker}
            errorText={this.state.dateError}
          />
        </div>
        <div>
          <TimePicker
            autoOk={true}
            defaultTime={null}
            floatingLabelText="Time"
            inputStyle={styles.text}
            name="time"
            value={this.state.time}
            onChange={this.handleTimePicker}
            errorText={this.state.timeError}
          />
        </div>
        <div>
          <TextField
            floatingLabelText="Location"
            inputStyle={styles.text}
            name="location"
            onChange={this.handleChange}
            value={this.state.location}
            errorText={this.state.locationError}
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
          <SelectField floatingLabelText={this.state.category} errorText={this.state.categoryError}>
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
