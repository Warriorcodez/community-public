import axios from 'axios';
import { addEvents, addGeolocation, changeCenter, changeHeader, setMarkers, updateForm } from '../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CreateEventForm from '../components/CreateEventForm';
import FindEvents from '../components/FindEvents';
import Gmap from '../components/GoogleMap';
import { GridList, Tabs, Tab } from 'material-ui';
import Header from '../components/Header';
import React, { Component } from 'react';

const style = {
  position: 'absolute',
  display: 'inline',
  height: '520px',
  width: '610px',
};

class Homepage extends Component {

  componentWillMount() {
    axios.get('/api/retrieveEvents')
    .then((data) => {
      this.props.addEvents(data.data);
    });
  }

  render() {
    return (
      <div>
        <Header header={this.props.header} />
        <GridList cellHeight="auto">
          <Tabs>
            <Tab label="Find Events">
              <FindEvents
                events={this.props.events}
                googleMap={this.props.googleMap}
              />
            </Tab>
            <Tab label="Create Event">
              <CreateEventForm
                className="createEventForm"
                createEventForm={this.props.createEventForm}
                updateForm={this.props.updateForm}
                setMarkers={this.props.setMarkers}
                markers={this.props.googleMap.markers}
                changeCenter={this.props.changeCenter}
                addEvents={this.props.addEvents}
                events={this.props.events}
              />
            </Tab>
          </Tabs>
          <div style={style}>
            <Gmap
              events={this.props.events}
              center={this.props.googleMap.center}
              markers={this.props.googleMap.markers}
              changeCenter={this.props.changeCenter}
              googleMap={this.props.googleMap.center}
              setMarkers={this.props.setMarkers}
              addGeolocation={this.props.addGeolocation}
              geolocation={this.props.googleMap.geolocation}
            />
          </div>
        </GridList>
      </div>
    );
  }
}

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    addEvents: addEvents,
    addGeolocation: addGeolocation,
    changeCenter: changeCenter,
    changeHeader: changeHeader,
    setMarkers: setMarkers,
    updateForm: updateForm
  }, dispatch);
};

const mapStateToProps = (state) => {
  return {
    header: state.header,
    createEventForm: state.createEventForm,
    googleMap: state.googleMap,
    events: state.events.allEvents
  };
};

export default connect(mapStateToProps, matchDispatchToProps)(Homepage);
