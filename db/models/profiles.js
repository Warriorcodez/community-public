const db = require('../');

const Profile = db.Model.extend({
  tableName: 'profiles',
  auths: function() {
    return this.hasMany('Auth');
  },
  events: function() {
    return this.belongsToMany('Event').through('Event_Profile');
  },
  events_profiles: function() {
    return this.hasMany('Event_Profile');
  },
});

module.exports = db.model('Profile', Profile);
