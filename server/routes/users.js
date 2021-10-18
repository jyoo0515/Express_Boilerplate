const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const auth = require("../middleware/auth");

router.route("/").get(usersController.getAll);

router.route("/me").all(auth.verifyToken).get(usersController.me);

router.route("/logout").get(usersController.logout);

router
  .route("/:uuid")
  .get(usersController.getOne)
  .delete(usersController.delete);

router.route("/register").post(usersController.register);

router.route("/login").post(usersController.login);

module.exports = router;
