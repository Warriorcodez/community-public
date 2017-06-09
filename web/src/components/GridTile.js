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
  }

  render() {
    return (
      <GridTile
        title={this.props.title}
        titleBackground={this.props.titleBackground}
        style={this.props.style}
        actionIcon={this.props.actionIcon}
        onClick={this.handleClick}
      >
        <img src={this.props.imageSRC} />
      </GridTile>
    );
  }
}

export default GridTileComponent;
