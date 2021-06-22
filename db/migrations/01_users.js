exports.up = (knex) => {
  return knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("name", 255).notNullable();
    table.string("surname", 255).notNullable();
    table.string("email", 255).notNullable().unique();
    table.string("username", 255).notNullable().unique();
    table.string("password", 255).notNullable();

    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("users");
};
