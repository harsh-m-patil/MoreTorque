const mongoose = require("mongoose");

const orgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Organization name is required"],
    unique: [true, "This organization name is already in use"],
    minLength: [4, "OrgName can be minimum of 4 length"],
    maxlength: [40, "OrgName can be maximum of 40 length"],
  },
  parentOrg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Org",
  },
  account: {
    type: String,
    required: [true, "Account is required"],
  },
  website: {
    type: String,
  },
  fuelReimbursementPolicy: {
    type: String,
    default: "1000",
  },
  speedLimitPolicy: {
    type: String,
    required: [true, "Speed limit policy is required"],
  },
  //childrenOrgs: [
  //  {
  //    type: mongoose.Schema.Types.ObjectId,
  //    ref: "Org",
  //  },
  //],
});

const Org = mongoose.model("Org", orgSchema);

module.exports = Org;
