const mongoose = require("mongoose");

const orgSchema = new mongoose.Schema({
  orgName: {
    type: String,
    required: [true, "Organization name is required"],
    unique: [true, "This organization name is already in use"],
  },
  parentOrg: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Org",
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
