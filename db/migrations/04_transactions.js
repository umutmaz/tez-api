exports.up = (knex) => {
  return knex.schema.createTable("transactions", (table) => {
    table.increments("id");
    table.string("hash", 255).notNullable();
    table.string("previous_hash", 255).notNullable();
    table.string("cid", 255).notNullable();
    table.integer("character_id").references("id").inTable("characters");
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("transactions");
};
