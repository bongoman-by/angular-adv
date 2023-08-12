const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const HospitalSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  user: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

HospitalSchema.plugin(uniqueValidator);

HospitalSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();

  return object;
});

module.exports = model("Hospital", HospitalSchema);
