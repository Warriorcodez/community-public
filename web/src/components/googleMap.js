import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import axios from 'axios';
import LocationInput from './LocationInput';

const Key = process.env.GOOGLE_API_KEY;
const GeoCodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const RevGeoCodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
const style = {
  position: 'absolute',
  height: '900px',
  width: '900px',
};

class Gmap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: this.props.markers
    };
    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
    this.handleMarkerRightClick = this.handleMarkerRightClick.bind(this);
    this.handleLocationInput = this.handleLocationInput.bind(this);
    // this.handleMarkerClick = this.handleMarkerClick.bind(this);
  }

  handleMapLoad(map) {
    this._mapComponent = map;
  }

  handleMapClick(event) {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const nextMarkers = [
      ...this.props.markers,
      {
        position: {lat: lat, lng: lng},
        defaultAnimation: 2,
        key: Date.now(),
      },
    ];
    this.props.setMarkers(nextMarkers);
    this.props.changeCenter({lat: lat, lng: lng});
    this.handleReverseGeoCode({lat: lat, lng: lng});
  }

  // handleMarkerClick(targetMarker) {
  //   console.log('meow!');
  // }

  handleMarkerRightClick(targetMarker) {
    const nextMarkers = this.props.markers.filter(marker => marker !== targetMarker);
    this.props.setMarkers(nextMarkers);
  }

  handleReverseGeoCode(latlng) {
    axios.get(RevGeoCodeURL + latlng.lat + ',' + latlng.lng + Key)
    .then((res) => {
      console.log(res.data.results[0].formatted_address);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  handleLocationInput(location) {
    let string = location.split(' ').join('+');
    axios.get(GeoCodeURL + string + Key)
    .then((res) => {
      const lat = res.data.results[0].geometry.location.lat;
      const lng = res.data.results[0].geometry.location.lng;
      const nextMarkers = [
        ...this.props.markers,
        {
          position: {
            lat: lat,
            lng: lng,
          },
          defaultAnimation: 2,
          key: Date.now(),
        },
      ];
      this.props.setMarkers(nextMarkers);
      this.props.changeCenter({lat: lat, lng: lng});
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render () {
    const Map = withGoogleMap(props => (
      <GoogleMap
        ref={props.onMapLoad}
        zoom={16}
        center={this.props.googleMap}
        onClick={props.onMapClick}
        >
          {props.markers.map((marker) => (
            <Marker
            {...marker}
            onRightClick={() => props.onMarkerRightClick(marker)}
          />
        ))}
      </GoogleMap>
    ));

    return (
      <div style={style}>
        <LocationInput LocationInput={this.handleLocationInput}/>
        <Map style={style}
          containerElement={ <div className='map-container' style={style}></div>}
          mapElement={ <div id='map' className='map-section' style={style}></div>}
          onMapLoad={this.handleMapLoad}
          onMapClick={this.handleMapClick}
          markers={this.props.markers}
          onMarkerRightClick={this.handleMarkerRightClick}
          // onMarkerClick={this.handleMarkerClick}
        />
      </div>
    );
  }
}

export default Gmap;
