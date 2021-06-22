import { Router } from "express";
// Models
import TransactionModel from "../models/transaction";

import CharacterModel from "../models/character";

// Helpers
import { successResp, errorResp } from "../helpers/http_util";
import { createLogger } from "../helpers/log";

const logger = createLogger("TX_SER");

const createTransactionRecord = async (req, res) => {
  const userID = req.userData.uid;
  const charCID = req.params.cid;
  const accountAddress = req.body.accountAddress;
  const hash = req.body.hash
  const char = await CharacterModel.where({ cid: charCID }).fetch({ require: true });
  let previous = await TransactionModel.where({ character_id: char.toJSON().id }).orderBy("created_at", "desc").fetchAll({ require: false });
  previous = previous.toJSON();
  const model = await new TransactionModel({ hash: hash, previous_hash: previous.length ? previous[0].hash : "none", character_id: char.toJSON().id, cid: charCID }).save().catch((err) => { logger.error(err); errorResp(res, err) });
  successResp(res, model.toJSON(), "CREATED")
};
const router = Router();

router
  .route("/:cid")
  .post(createTransactionRecord);


export default router;
