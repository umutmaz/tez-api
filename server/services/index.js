// Authorization Routes
import AuthRoutes from "./auth/auth_router";

// Model Routes
import UserRoutes from "./user_service";
import AccountRoutes from "./account_service";
import CharacterRoutes from "./character_service";
import TransactionRoutes from "./transaction_service";

const express = require("express");

const publicServiceRoutes = express.Router();
const privateServiceRoutes = express.Router();

// Public Routes
publicServiceRoutes.use("/auth", AuthRoutes);

// Private Routes
privateServiceRoutes.use("/user", UserRoutes);
privateServiceRoutes.use("/account", AccountRoutes);
privateServiceRoutes.use("/character", CharacterRoutes);
privateServiceRoutes.use("/transaction", TransactionRoutes)

export default {
  publicServiceRoutes,
  privateServiceRoutes,
};
