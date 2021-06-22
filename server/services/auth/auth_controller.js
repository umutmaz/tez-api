import jwt from "jsonwebtoken";
import config from "../../../config";

// Helpers
import { createLogger } from "../../helpers/log";
import { successResp, errorResp } from "../../helpers/http_util";

// Models
import UserModel from "../../models/user";

const logger = createLogger("AUT_SER");

/**
 * Create JWT by using information of user
 * @param {UserModel} user
 */
function createToken(user) {
  return jwt.sign(
    {
      uid: user.id,
      umail: user.email,
      urole: user.role,
      uusername: user.username,
      uloginTime: Date.now(),
    },
    config.jwt.secret,
    jwt.options
  );
}

/**
 * Login with username and password
 */
const login = (req, res) => {
  const { username, password } = req.body;

  logger.debug(`login start:`, { username, password });

  UserModel.verify(username, password)
    .then((user) => {
      logger.debug(`login(${username}) :`, user);
      const token = createToken(user);
      successResp(res, {
        token,
        user: user,
      });
    })
    .catch((err) => {
      logger.error(`login(${username}) :`, err);
      errorResp(res, err);
    });
};

/**
 * Register New User
 */
const register = async (req, res) => {
  try {
    const data = req.body;

    logger.debug("register start :", data);

    const control = await UserModel.query({
      where: { username: data.username },
      // orWhere: {
      //   email: data.email,
      // },
    }).fetch({ require: false });

    if (control) {
      logger.error("register : Used Username or Email");
      errorResp(res, new Error("Username or Email is already using"));
      return;
    }

    const insertedModel = await UserModel.forge(data)
      .save()
      .catch((err) => {
        errorResp(res, err);
      });

    const user = insertedModel.toJSON();

    const token = createToken(user);
    logger.debug("register start :", user);

    successResp(res, {
      token,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    logger.error("register :", err);
    errorResp(res, err);
  }
};

export default {
  login,
  register,
};
