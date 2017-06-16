import React, { Component } from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { Menu, MenuItem, DropDownMenu, RaisedButton, FlatButton, Popover, SelectField } from 'material-ui';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import SwapVert from 'material-ui-icons/SwapVert';
import FilterList from 'material-ui-icons/FilterList';
import axios from 'axios';

class Tools extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 'Select Category...',
      category: 'All',
      showSortOptions: false,
      showFilterOptions: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.toggleSort = this.toggleSort.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleGeolocationSort = this.handleGeolocationSort.bind(this);
    this.handlePopularitySort = this.handlePopularitySort.bind(this);
  }

  handleChange(e) {
    this.setState({ category: e.target.innerHTML });
    axios.get('/api/retrieveEventsByCategory?query=' + e.target.innerHTML)
    .then((data) => {
      this.handleRequestClose();
      this.props.addEvents(data.data);
      const lat = data.data[0].lat;
      const lng = data.data[0].lng;
      this.props.changeCenter({lat: Number(lat), lng: Number(lng)});
    })
    .catch((err) => {
      console.log(err);
    });
  }

  toggleSort(event) {
    event.preventDefault();
    this.setState({
      showSortOptions: true,
      sortAnchorEl: event.currentTarget,
    });
  }

  toggleFilter(event) {
    event.preventDefault();
    this.setState({
      showFilterOptions: true,
      filterAnchorEl: event.currentTarget,
    });
  }

  handleRequestClose() {
    this.setState({
      showSortOptions: false,
      showFilterOptions: false,
    });
  }

  handleGeolocationSort() {
    console.log(this.props.geolocation[0].position);
    axios.post('/api/retrieveEventsByLocation', this.props.geolocation[0].position)
    .then((res) => {
      this.props.addEvents(res.data);
      this.handleRequestClose();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handlePopularitySort() {
    axios.get('/api/retrieveEventsByPopularity')
    .then((res) => {
      this.props.addEvents(res.data);
      this.handleRequestClose();
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
      <Toolbar style={styles.tools}>
        <ToolbarGroup>
          <FlatButton
            label="Sort By"
            onTouchTap={this.toggleSort}
            style={[styles.text, { width: 130 }]}
            icon={<SwapVert />}
          />
          <Popover
            open={this.state.showSortOptions}
            anchorEl={this.state.sortAnchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
            >
            <Menu style={{width: 100}}>
              <MenuItem primaryText="Location" onTouchTap={this.handleGeolocationSort}/>
              <MenuItem primaryText="Popularity" onTouchTap={this.handlePopularitySort}/>
            </Menu>
          </Popover>
        </ToolbarGroup>
        <ToolbarGroup>
          <FlatButton
            label="Filter Category"
            onTouchTap={this.toggleFilter}
            style={[styles.text, { width: 200}]}
            icon={<FilterList/>}
          />
          <Popover
            open={this.state.showFilterOptions}
            anchorEl={this.state.filterAnchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
            >
            <Menu
              value={this.state.category}
              style={{width: 165}}
              onChange={this.handleChange} >
              <MenuItem value="All" primaryText="All" />
              <MenuItem value="Food" primaryText="Food" />
              <MenuItem value="Sports" primaryText="Sports" />
              <MenuItem value="Outdoors" primaryText="Outdoors" />
              <MenuItem value="Nightlife" primaryText="Nightlife" />
              <MenuItem value="Games" primaryText="Games" />
              <MenuItem value="Other" primaryText="Other" />
            </Menu>
          </Popover>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarSeparator />
          <RaisedButton
            label="Create Event"
            style={{width: 175}}
            primary={true}
            onTouchTap={this.props.toggleCreateEvent} />
        </ToolbarGroup>
      </Toolbar>
    );

  }
}

const styles = {
  button: {
    backgroundColor: 'white',
    border: '1px solid #31575B',
    color: '#31575B'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    height: '100%',
  },
  theme: {
    fontFamily: 'Roboto',
    fontSize: '20px'
  },
  gridList: {
    height: '100%',
    padding: 15,
    overflowY: 'auto'
  },
  tile: {
    margin: 10,
    width: 270,
    cursor: 'pointer',
  },
  dropdown: {
    width: 250,
    position: 'relative',
    left: '120'
  },
  tools: {
    height: window.innerHeight * .06,
    backgroundColor: '#fff',
  },
  text: {
    color: '#31575B',
  }
};

export default Tools;
