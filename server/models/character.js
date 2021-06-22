import db from "../../db";

const bookshelf = require("bookshelf")(db);

const Character = bookshelf.model("Character", {
  tableName: "characters",
  owner() {
    return this.belongsTo("User");
  },
});

export default Character;
