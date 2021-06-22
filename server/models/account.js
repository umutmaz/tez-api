import db from "../../db";

const bookshelf = require("bookshelf")(db);

const Account = bookshelf.model("Account", {
  tableName: "accounts",
  owner() {
    return this.belongsTo("User");
  },
});

export default Account;
