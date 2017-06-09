const db = require('../');

const Event_Profile = db.Model.extend({
  tableName: 'events_profiles',
  event: function() {
    return this.belongsTo('Event');
  },
  profile: function() {
    return this.belongsTo('Profile');
  },
});

module.exports = db.model('Event_Profile', Event_Profile);
