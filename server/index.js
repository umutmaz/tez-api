import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import config from "../config";

// Service Routes
import ServiceRouter from "./services";

// Middleware
import errorMiddleware from "./middlewares/error_middleware";
import authMiddleware from "./middlewares/auth_middleware";

// Config
const { apiVersion, CODE, env } = config;
const apiRoute = `/${apiVersion}`;

const express = require("express");
const swaggerDocRouter = require("./docs/swagger/router");

// Server
const app = express();
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Audit
app.use(`/version`, (req, res) => {
  res.status(CODE.OK).json({
    data: {
      env,
      apiVersion,
    },
  });
});

// Authorization
app.use(apiRoute, authMiddleware);

app.use("/doc", swaggerDocRouter);

app.use(apiRoute, ServiceRouter.privateServiceRoutes);
app.use("/", ServiceRouter.publicServiceRoutes);


app.use(errorMiddleware);

export default app;
