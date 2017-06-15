import { AppBar, Drawer, MenuItem } from 'material-ui';
import axios from 'axios';
import React, { Component } from 'react';
import Menu from 'material-ui-icons/Menu';
import IconButton from 'material-ui/IconButton';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleHome = this.handleHome.bind(this);
    this.handleEditProfile = this.handleEditProfile.bind(this);
  }

  toggleDrawer() {
    this.setState({
      open: !this.state.open
    });
  }

  handleClose(event) {
    this.setState({
      open: false
    });
  }

  handleEditProfile() {
    axios.get('/profile');
  }

  handleHome() {
    axios.get('/');
  }

  handleLogout() {
    axios.get('/logout');
  }

  render () {
    return (
      <div>
        <AppBar
          title="Community"
          style={styles.theme}
          titleStyle={styles.title}
          iconElementLeft={
            <IconButton>
              <Menu color={'#3798db'} />
            </IconButton>}
          onLeftIconButtonTouchTap={this.toggleDrawer}
          docked={true}
          // iconStyleLeft={{icon: {tintColor: '#3EB1E0'}}}
        />
          <Drawer
            open={this.state.open}
            onRequestChange={open => this.setState({ open })}
            docked={false}
          >
            <AppBar
              title="Community"
              showMenuIconButton={false}
              style={styles.theme}
              titleStyle={styles.title}
            />
            <MenuItem
              onTouchTap={this.handleClose}
              onTouchTap={this.handleHome}
              primaryText="Home"
              href={'/'}
            />
            <MenuItem
              onTouchTap={this.handleClose}
              onTouchTap={this.handleEditProfile}
              primaryText="My Profile"
              href={'/profile'}
            />
            <MenuItem
              onTouchTap={this.handleClose}
              onTouchTap={this.handleLogout}
              primaryText="Logout"
              href={'/login'}
            />
          </Drawer>
      </div>
    );
  }
}

const styles = {
  title: {
    fontFamily: 'Vibur',
    fontSize: '34px',
    color: '#C22B33'
  },
  theme: {
    backgroundColor: 'white'
  }
};

export default Header;
