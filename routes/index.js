import express from "express";
import {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  Register,
  Login,
  Logout,
} from "../controllers/Users.js";
import {
  insertDapil,
  getAllDapil,
  getDapilById,
  updateDapilById,
  deleteDapilById,
} from "../controllers/Dapil.js";
import {
  insertBulkSuaraParpol,
  getSuaraParpolByDapilId,
  getSuaraParpolById,
  updateSuaraParpolById,
  deleteSuaraParpolById,
} from "../controllers/SuaraParpol.js";
import { verifyToken } from "../middleware/verifytoken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.post("/users", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

// router.get("/users", verifyToken, getUsers);
// router.get("/users/:id", verifyToken, getUserById);
// router.patch("/users/:id", verifyToken, updateUserById);
// router.delete("/users/:id", verifyToken, deleteUserById);

// router.get("/dapil", verifyToken, getAllDapil);
// router.get("/dapil/:id", verifyToken, getDapilById);
// router.post("/dapil", verifyToken, insertDapil);
// router.patch("/dapil/:id", verifyToken, updateDapilById);
// router.delete("/dapil/:id", verifyToken, deleteDapilById);

// router.post("/parpol", verifyToken, insertBulkSuaraParpol);
// router.get("/parpol/dapil", verifyToken, getSuaraParpolByDapilId);
// router.get("/parpol/suara", verifyToken, getSuaraParpolById);
// router.patch("/parpol/suara/:id", verifyToken, updateSuaraParpolById);
// router.delete("/parpol/suara/:id", verifyToken, deleteSuaraParpolById);

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUserById);
router.delete("/users/:id", deleteUserById);

router.get("/dapil/:user_id", getAllDapil);
router.get("/detail-dapil/:id", getDapilById);
router.post("/dapil", insertDapil);
router.put("/dapil/:id", updateDapilById);
router.delete("/dapil/:id", deleteDapilById);

router.get("/parpol/dapil/:dapil_id", getSuaraParpolByDapilId);
router.get("/parpol/suara/:id", getSuaraParpolById);
router.put("/parpol/suara/:id", updateSuaraParpolById);
router.delete("/parpol/suara/:id", deleteSuaraParpolById);
router.post("/parpol", insertBulkSuaraParpol);

export default router;
