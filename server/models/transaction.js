import db from "../../db";

const bookshelf = require("bookshelf")(db);

const Transaction = bookshelf.model("Transaction", {
  tableName: "transactions",
  ownerAccount() {
    return this.belongsTo("Account", "address");
  },
  of() {
    return this.belongsTo("Character");
  },
});

export default Transaction;
