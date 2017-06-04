import { Card, GridTile, IconButton, Subheader } from 'material-ui';
import Promise from 'bluebird';
import React, { Component } from 'react';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

class GridTileComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onClick(this.props.indexID);
    //axios request
  }


  render() {
    return (
      <GridTile
        title={this.props.title}
        titleBackground={this.props.titleBackground}
        // subtitle={<span>by <b>{tile.host_name}</b></span>}
        style={this.props.style}
        actionIcon={this.props.actionIcon}
        onClick={this.handleClick}
      >
        <img src={this.props.imageSRC} />
      </GridTile>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    height: 490,
    padding: 15,
    overflowY: 'auto',
  },
  tile: {
    margin: 10
  }
};

export default GridTileComponent;
