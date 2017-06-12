const db = require('../');

const Comment = db.Model.extend({
  tableName: 'comments',
  event: function() {
    return this.belongsTo('Event');
  },
  profile: function() {
    return this.belongsTo('Profile');
  }
});

module.exports = db.model('Comment', Comment);
