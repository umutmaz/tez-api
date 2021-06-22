import { Router } from "express";
import AuthController from "./auth_controller";

const router = Router();

router.route("/login").post(AuthController.login);

router.route("/register").post(AuthController.register);

export default router;
