import { AppBar } from 'material-ui';
import React, { Component } from 'react';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
        <AppBar
          title="Community"
          style={styles.theme}
          titleStyle={styles.title}
        />
      </div>
    );
  }
}

const styles = {
  title: {
    fontFamily: 'Vibur',
    fontSize: '34px'
  },
  theme: {
    backgroundColor: '#5E35B1',
  }
};

export default Header;
