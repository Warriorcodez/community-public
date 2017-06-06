import { AppBar, Drawer, MenuItem } from 'material-ui';
import React, { Component } from 'react';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  toggleDrawer() {
    this.setState({
      open: !this.state.open
    });
    console.log('this was clicked and it should be doing something');
  }

  handleClose(event) {
    this.setState({
      open: false
    });
  }

  render () {
    return (
      <div>
        <AppBar
          title="Community"
          style={styles.theme}
          titleStyle={styles.title}
          onLeftIconButtonTouchTap={this.toggleDrawer}
        />
          <Drawer
            label={'HI'}
            open={this.state.open}
            onRequestChange={open => this.setState({ open })}
          >
            <AppBar
              title="Community"
              showMenuIconButton={false}
              style={styles.theme}
              titleStyle={styles.title}
            />
            <MenuItem
              onTouchTap={this.handleClose}
              primaryText="User profile"
            />
            <MenuItem
              onTouchTap={this.handleClose}
              primaryText="Logout"
              // containerElement={<Link to="/logout"/>}
            />
          </Drawer>
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
