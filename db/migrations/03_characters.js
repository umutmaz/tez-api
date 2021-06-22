exports.up = (knex) => {
  return knex.schema.createTable("characters", (table) => {
    table.increments("id");
    table.string("name", 255).notNullable();
    table.string("cid", 255).notNullable();
    table.integer("account_id").references("id").inTable("accounts");
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("characters");
};
