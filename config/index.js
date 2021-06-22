require("dotenv").config();

export default {
  serverPort: 3131,
  version: "v0.1",
  apiVersion: "v0",
  ipfsHost: "localhost",
  ipfsPort: 5001,
  ipfsProtocol: "http",
  env: "development",
  jwt: {
    secret: process.env.JWT_SECRET,
    options: { expiresIn: "1h", issuer: "umutmaz" },
  },
  dbConfig: {
    host: "localhost",
    user: "postgres",
    password: "asdqwe1234",
    port: "5432",
    database: "tez",
  },
  cryptoConfig: {
    simetricKey: "LoAtE+^21+2FVtslu3242S!!+%loGt.S",
  },
  debug: process.env.DEBUG,
  baseURL: "localhost",
  saltingRounds: 10,
  logLevels: [],
  CODE: {
    OK: 200,
    CREATED: 201,
    OK_NO_DATA: 204,
    ERR: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    GENERIC_ERROR: 500,
  },
  log: {
    debug: false,
    errorFile: false,
  },
};
