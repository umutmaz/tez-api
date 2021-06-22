import UserModel from "../../server/models/user";
import { createLogger } from "../../server/helpers/log";

const logger = createLogger("USR_SEED");

exports.seed = (knex) =>
  knex(new UserModel().tableName)
    .del()
    .then(() => [
      {
        name: "admin",
        surname: "admin",
        username: "admin",
        password: "asdqwe1234",
        email: "admin@admin.io",
      },
    ])
    .then((newUser) =>
      Promise.all(newUser.map((user) => new UserModel(user).save())).then(
        ([savedUser]) => {
          logger.info("OK : ", savedUser.get("username"));
        }
      )
    )
    .catch((err) => logger.error(err));
