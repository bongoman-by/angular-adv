const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    default: "USER_ROLE",
  },
  google: {
    type: Boolean,
    default: false,
  },
});

UserSchema.plugin(uniqueValidator);

UserSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("User", UserSchema);
