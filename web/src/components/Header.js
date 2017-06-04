import { AppBar } from 'material-ui';
import React, { Component } from 'react';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
        <AppBar title="Community" />
      </div>
    );
  }
}

export default Header;
