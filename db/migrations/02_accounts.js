exports.up = (knex) => {
  return knex.schema.createTable("accounts", (table) => {
    table.increments("id");
    table.string("address", 255).notNullable().unique();
    table.integer("user_id").references("id").inTable("users");
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("accounts");
};
