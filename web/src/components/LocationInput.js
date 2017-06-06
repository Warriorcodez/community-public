import { AutoComplete, Card, RaisedButton, TextField } from 'material-ui';
import axios from 'axios';
import Promise from 'bluebird';
import React, { Component } from 'react';

const GeoCodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

export default class LocationInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      autoComplete: [{
        geometry: {
          location: {
            lat: null,
            lng: null,
          }
        }
      }],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLocationSearch = this.handleLocationSearch.bind(this);
    this.handleLocationInput = this.handleLocationInput.bind(this);
  }

  handleChange (value) {
    return new Promise ((resolve, reject) => {
      resolve(this.setState({
        location: value
      }));
    })
    .then(() => {
      this.handleLocationInput(this.state.location);
    });
  }

  handleLocationSearch() {
    const lat = this.state.autoComplete[0].geometry.location.lat;
    const lng = this.state.autoComplete[0].geometry.location.lng;
    this.props.changeCenter({lat: lat, lng: lng});
    this.props.handleReverseGeoCode({lat: lat, lng: lng});
  }

  handleLocationInput(location) {
    let string = location.split(' ').join('+');
    axios.post('/api/locationInput', {location: string})
    .then((res) => {
      let acArray = [];
      for (let i = 0; i < res.data.length; i++) {
        acArray.push(res.data[i]);
      }
      return acArray;
    })
    .then((array) => {
      this.setState({
        autoComplete: array
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render () {
    const dataSource = this.state.autoComplete.map((obj) => {
      return obj.formatted_address;
    });
    const filter = () => true;
    return (
      <Card >
        <AutoComplete dataSource={dataSource}
          autoFocus
          filter={filter}
          name="address"
          onUpdateInput={this.handleChange}
          placeholder={'Search Location'}
          textFieldStyle={styles.location}
          underlineStyle={styles.underline}
          value={this.state.location}
        />
        <RaisedButton
          label="Search"
          onTouchTap={this.handleLocationSearch}
          labelStyle={styles.buttonLabel}
          labelColor={'#5E35B1'}
          style={styles.button}
        />
      </Card>
    );
  }
}

const styles = {
  button: {
    border: '1px solid #5E35B1',
    borderRadius: '10px',
    marginLeft: '18px'
  },
  buttonLabel: {
    fontFamily: 'Vibur',
    fontSize: '18px',
    textTransform: 'capitalize',
  },
  location: {
    borderColor: '#5E35B1',
    fontFamily: 'Vibur',
    fontSize: '20px',
    marginLeft: '8px',
    marginRight: '8px',
  },
  underline: {
  }
};
