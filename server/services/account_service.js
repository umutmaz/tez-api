import { Router } from "express";

// Models
import AccountModel from "../models/account";

// Helpers
import { successResp, errorResp, successRespExtend } from "../helpers/http_util";
import { createLogger } from "../helpers/log";

const logger = createLogger("ACC_SER");

const getAccounts = (req, res) => {
  const userID = req.userData.uid;
  logger.debug("getAccounts start: ", userID);
  AccountModel.where({ user_id: userID })
    .fetchAll()
    .then((result) => {
      logger.debug("getAccounts result: ", result);
      successResp(res, result);
    })
    .catch((err) => {
      logger.error("getAccounts error: ", err);
      errorResp(res, err);
    });
};

const checkAccountOwnership = (req, res) => {
  const userID = req.userData.uid;
  const { address } = req.params;
  logger.debug("checkAccountOwnership start: ", userID);
  AccountModel.where({ address: address })
    .fetch({ require: false })
    .then((result) => {



      if (!result) {
        logger.debug("checkAccountOwnership result: ", null);
        successRespExtend(res, { data: {}, message: "Account is not registered" }, "OK")
      } else if (result.toJSON().user_id !== userID) {
        successRespExtend(res, { data: {}, message: "Account is registered to another user" }, "OK")
      } else {
        logger.debug("checkAccountOwnership result: ", result.toJSON());
        successRespExtend(res, { data: {}, message: "Account is registered to user" }, "OK")
      }
    })
    .catch((err) => {
      logger.error("checkAccountOwnership error: ", err);
      errorResp(res, err);
    });
};

const addAccount = (req, res) => {
  const userID = req.userData.uid;
  const { address } = req.body;
  logger.debug("addAccount start: ", address);
  AccountModel.forge({
    address,
    user_id: userID,
  })
    .save()
    .then((addedAccount) => {
      logger.debug("addAccount added: ", addedAccount);
      successResp(res, addedAccount.toJSON(), "CREATED");
    })
    .catch((err) => {
      logger.error("addAccount error: ", err);
      errorResp(res, err);
    });
};

const deleteAccount = (req, res) => {
  const userID = req.userData.uid;
  const { id } = req.params;
  logger.debug("deleteAccount start: ", id);
  AccountModel.where({ user_id: userID, id })
    .destroy()
    .then(() => {
      logger.log("deleteAccount success");
      successResp(res);
    })
    .catch((err) => {
      logger.error("deleteAccount error: ", err);
      errorResp(res, err);
    });
};
const getOneAccount = (req, res) => {
  const userID = req.userData.uid;
  const { id } = req.params;
  logger.debug("getOneAccount start: ", id);
  AccountModel.where({ id, user_id: userID })
    .fetch({ require: true })
    .then((account) => {
      logger.log("getOneAccount result: ", account);
      successResp(res, account);
    })
    .catch((err) => {
      logger.error("getOneAccount error: ", err);
      errorResp(res, err);
    });
};

const router = Router();
router.route("/").get(getAccounts).post(addAccount);
router.route("/check/:address").get(checkAccountOwnership)
router.route("/:id").get(getOneAccount).delete(deleteAccount);
export default router;
