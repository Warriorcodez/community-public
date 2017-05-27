import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { changeHeader, updateForm, changeCenter } from '../actions';
import Header from '../components/Header';
import CreateEventForm from '../components/CreateEventForm';
import Gmap from '../components/googleMap';

const style = {
  position: 'absolute',
  height: '900px',
  width: '900px',
};

class Homepage extends Component {

  render() {
    return (
			<div>
        <Header changeHeader={this.props.changeHeader} header={this.props.header}/>
        <CreateEventForm
          createEventForm={this.props.createEventForm}
          updateForm={this.props.updateForm}
        />
        <div style={style}>
          <Gmap style={style}
            center={this.props.googleMap}
            markers={[]}
            changeCenter={this.props.changeCenter}
            googleMap={this.props.googleMap}
          />
        </div>
			</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    header: state.header,
    createEventForm: state.createEventForm,
    googleMap: state.googleMap
  };
};

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({
    changeHeader: changeHeader,
    updateForm: updateForm,
    changeCenter: changeCenter
  }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Homepage);
