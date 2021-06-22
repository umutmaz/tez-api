import { Router } from "express";
import fileUpload from "express-fileupload";
const multer = require('multer');
// Models
import CharacterModel from "../models/character";
import TransactionModel from "../models/transaction";
import AccountModel from "../models/account";

// Helpers
import { successResp, errorResp } from "../helpers/http_util";
import { createLogger } from "../helpers/log";

const IPFS = require("ipfs-api");
const upload = multer({ dest: '../../uploads' })
const logger = createLogger("CHR_SER");

const validateAccountAddress = async (req, res, next) => {
  const userID = req.userData.uid;
  const accountAddres = req.body.address;
  const record = await AccountModel.where({
    user_id: userID,
    address: accountAddres,
  })
    .fetch({ require: true })
    .catch((err) => {
      logger.error("Invalid account");
      errorResp(res, err);
    });
  if (record) {
    next();
  }
};

const ipfs = new IPFS('ipfs.infura.io', '5001', { protocol: 'https' });

const createCharacter = async (req, res) => {
  const charFile = req.files.files.data;
  const userID = req.userData.uid;
  const charName = req.body.name;
  const accountAddress = req.body.address;

  const account = await AccountModel.where({ address: accountAddress, user_id: userID }).fetch({ require: true }).catch((err) => errorResp(res, err));
  const accountID = account.toJSON().id;

  ipfs.add(new Buffer(charFile), (err, hash) => {
    if (err) {
      logger.error(err);
      errorResp(res, err);
    }
    CharacterModel.forge({
      name: charName,
      cid: hash[0].hash,
      account_id: accountID,
    })
      .save()
      .then((char) => {
        successResp(res, char.toJSON(), "CREATED");
      })
      .catch((error) => {
        logger.error(error);
        errorResp(res, error);
      });
  });
};

const getAllCharactersOfUserAccount = async (req, res) => {
  const userID = req.userData.uid;
  const accountAddress = req.params.accountID;
  AccountModel.where({ user_id: userID, address: accountAddress }).fetch().then((account) => {
    const accountID = account.toJSON().id;
    CharacterModel.where({
      account_id: accountID
    })
      .fetchAll()
      .then(async (userChars) => {
        const userCharsJSON = await Promise.all(userChars.map((c) => {
          const char = c.toJSON();
          return TransactionModel.where({ character_id: char.id }).orderBy("created_at", "desc").fetchAll({ require: false }).then((t) => {
            char.hash = t.toJSON()[0].hash;
            return char;
          })
        }));
        successResp(res, userCharsJSON);
      })
      .catch((err) => {
        logger.error(err);
        errorResp(res, err);
      });

  }).catch(err => console.log(err));

};

const deleteCharacter = (req, res) => {
  const userID = req.userData.uid;
  const charID = req.params.id;
  const accountAddress = req.body.address;

  CharacterModel.where({
    id: charID,
    user_id: userID,
  })
    .destroy()
    .then(() => {
      // need to delete cid both from ipfs and db, set deleted flag on chain
      successResp(res);
    })
    .catch((err) => {
      logger.error(err);
      errorResp(res, err);
    });
};

const progressCharacter = async (req, res) => {
  const charID = req.params.id;
  const userID = req.userData.uid;
  const charFile = req.files.files.data;
  const accountAddress = req.body.address;

  const account = await AccountModel.where({ address: accountAddress, user_id: userID }).fetch({ require: true }).catch((err) => errorResp(res, err));
  const accountID = account.toJSON().id;
  // need to get the latest txhash of the charID,
  const latestRecorded = await TransactionModel.where({ character_id: charID })
    .orderBy("created_at", "DESC")
    .fetch()
    .catch((error) => {
      logger.error(error);
      errorResp(res, error);
    });

  let exHash = latestRecorded.toJSON().hash;
  // need to upload current one and update db,
  ipfs.add(new Buffer(charFile), async (err, hash) => {
    if (err) {
      logger.error(err);
      errorResp(res, err);
    }
    CharacterModel.where({
      id: charID,
      account_id: accountID
    })
      .save({ cid: hash[0].hash }, { method: "update" }).then((updatedChar) => {
        const charToReturn = updatedChar.toJSON();
        charToReturn.prev_hash = exHash;
        successResp(res, updatedChar.toJSON(), "CREATED");
      })
      .catch((error) => {
        logger.error(error);
        errorResp(res, error);
      });
    // need to transact with current cid and txHash

    // const dummyHash = "aldksfalkjsdh";
    // //save to db tx
    // await TransactionModel.forge({
    //   hash: dummyHash,
    //   previous_hash: exHash,
    //   character_id: charID,
    //   user_account: accountAddress,
    // })
    //   .save()
    //   .catch((error) => {
    //     logger.error(error);
    //     errorResp(res, error);
    //   });
  });
};

const getOneCharacterHistory = (req, res) => {
  const userID = req.userData.uid;
  const charID = req.params.id;

  TransactionModel.where({
    character_id: charID,
  }).orderBy("created_at", "desc")
    .fetchAll()
    .then((records) => {
      successResp(res, records.toJSON());
    })
    .catch((err) => {
      logger.error(err);
      errorResp(res, err);
    });
};
const router = Router();
router.use(fileUpload())
router
  .route("/")
  .post(validateAccountAddress, createCharacter);
router.route("/account/:accountID").get(getAllCharactersOfUserAccount);
router
  .route("/:id")
  .put(validateAccountAddress, progressCharacter)
  .delete(validateAccountAddress, deleteCharacter)
  .get(getOneCharacterHistory);
export default router;
