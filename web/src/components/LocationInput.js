import React, { Component } from 'react';
import { RaisedButton, TextField, Card } from 'material-ui';

export default class LocationInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      lat: null,
      lng: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleLocationSearch = this.handleLocationSearch.bind(this);
  }

  handleChange (e) {
    this.setState({
      location: e.target.value
    });
  }

  handleLocationSearch () {
    this.props.LocationInput(this.state.location);
  }

  render () {
    return (
      <Card className="searchLocation">
        <label> Location: </label>
        <TextField
          name="address"
          value={this.state.location}
          autoFocus
          onChange={this.handleChange}/>
        <RaisedButton label="search" onTouchTap={this.handleLocationSearch}/>
      </Card>
    );
  }
}
