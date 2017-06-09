import axios from 'axios';
import { Card, Dialog, FlatButton, GridList, GridTile, IconButton, Subheader } from 'material-ui';
import GridTileComponent from './GridTile.js';
import Promise from 'bluebird';
import React, { Component } from 'react';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

class ProfileGrid extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card
        style={styles.container}
        containerStyle={styles.container}
      >
        <GridList style={styles.gridList}>
          {this.props.events.map((tile, i) => (
            <GridTileComponent
              key={i}
              indexID={i}
              title={tile.event_name}
              titleBackground="linear-gradient(to top, rgba(127,0,255,0.7) 0%,rgba(127,0,255,0.3) 70%,rgba(127,0,255,0) 100%)"
              style={styles.tile}
              actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
              imageSRC={tile.image}
              data={this.props.events}
              onClick={() => console.log('clicked')}
            >
            </GridTileComponent>
          ))}
        </GridList>
      </Card>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  theme: {
    fontFamily: 'Vibur',
    fontSize: '20px'
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    width: 1150,
    height: 200,
    overflowX: 'auto',
    padding: 10
    // marginLeft: 10,
  },
  tile: {
    margin: 10,
    width: 280,
    height: 180,
    color: 'rgb(0, 188, 212)',
  },
};

export default ProfileGrid;
