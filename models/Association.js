import User from "./UserModel.js";
import Profile from "./ProfileModel.js";
import Dapil from "./DapilModel.js";
import SuaraParpol from "./SuaraParpolModel.js";

// parpol tidak memiliki asosiasi dengan suaraparpol
// karena suara parpol terdapat fitur upload data dari di excel

User.hasOne(Profile, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Profile.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Dapil.hasMany(SuaraParpol, {
  foreignKey: "daerah_pemilihan_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
