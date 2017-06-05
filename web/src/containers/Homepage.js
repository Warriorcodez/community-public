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
        <GridList>
          <Tabs
            contentContainerStyle={styles.container}
            tabTemplateStyle={styles.gridContainer}
          >
            <Tab
              label="Find Events"
              style={styles.theme}
            >
              <FindEvents
                events={this.props.events}
                googleMap={this.props.googleMap}
              />
            </Tab>
            <Tab
              label="Create Event"
              style={styles.theme}
            >
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
          <div style={styles.style}>
            <Gmap
              addGeolocation={this.props.addGeolocation}
              center={this.props.googleMap.center}
              changeCenter={this.props.changeCenter}
              events={this.props.events}
              geolocation={this.props.googleMap.geolocation}
              googleMap={this.props.googleMap.center}
              markers={this.props.googleMap.markers}
              setMarkers={this.props.setMarkers}
              style={styles.location}
            />
          </div>
        </GridList>
      </div>
    );
  }
}

const styles = {
  container: { // outside div
    position: 'absolute',
    height: 'calc(100% - 112px)',
    width: '50%',
  },
  gridContainer: { // inside div
    height: '100%',
  },
  theme: {
    borderColor: '#5E35B1',
    backgroundColor: '#D1C4E9',
    fontFamily: 'Vibur',
    borderRightStyle: 'dotted',
    border: '1',
    borderWidth: '1px',
  },
  location: {
    fontFamily: 'Vibur'
  }
};

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
