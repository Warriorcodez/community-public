
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('profiles', function (table) {
      table.increments('id').unsigned().primary();
      table.string('first', 100).nullable();
      table.string('last', 100).nullable();
      table.string('display', 100).nullable();
      table.string('email', 100).nullable().unique();
      table.string('phone', 100).nullable();
      table.string('profile_picture', 700).nullable();
      table.timestamps(true, true);
    }),
    knex.schema.createTableIfNotExists('auths', function(table) {
      table.increments('id').unsigned().primary();
      table.string('type', 8).notNullable();
      table.string('oauth_id', 30).nullable();
      table.string('password', 100).nullable();
      table.string('salt', 100).nullable();
      table.integer('profile_id').references('profiles.id').onDelete('CASCADE');
    }),
    knex.schema.createTableIfNotExists('comments', function(table) {
      table.increments('id').unsigned().primary();
      table.string('text', 500).notNullable();
      table.integer('event_id').references('events.id').onDelete('CASCADE');
      table.integer('profile_id').references('profiles.id').onDelete('CASCADE');
    }),
    knex.schema.createTableIfNotExists('events', function(table) {
      table.increments('id').unsigned().primary();
      table.string('event_name', 30).notNullable();
      table.dateTime('time').notNullable();
      table.string('location', 100).notNullable();
      table.string('category', 30).notNullable();
      table.string('description', 100).nullable();
      table.string('image', 500).nullable();
      table.integer('like_count').nullable();
      table.decimal('lat', 20, 15).notNullable();
      table.decimal('lng', 20, 15).notNullable();
      table.integer('profile_id').references('profiles.id').onDelete('CASCADE');
    }),
    knex.schema.createTableIfNotExists('events_profiles', function(table) {
      table.increments('id').unsigned().primary();
      table.boolean('is_attending').defaultTo(false);
      table.boolean('liked').defaultTo(false);
      table.integer('event_id').references('events.id').onDelete('CASCADE');
      table.integer('profile_id').references('profiles.id').onDelete('CASCADE');
    }),
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('auths'),
    knex.schema.dropTable('comments'),
    knex.schema.dropTable('events_profiles'),
    knex.schema.dropTable('events'),
    knex.schema.dropTable('profiles'),
  ]);
};
