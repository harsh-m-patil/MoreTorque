const validator = require("validator");
const Org = require("../models/orgModel");
const APIFeatures = require("../utils/APIFeatures");

exports.createOrg = async (req, res, next) => {
  try {
    if (req.body.parentOrg) {
      const parentOrg = await Org.findById(req.body.parentOrg);
      if (!parentOrg) {
        return res.status(404).json({
          status: "fail",
          message: "Parent organization not found",
        });
      }
    }

    if (req.body.website) {
      if (!validator.isURL(req.body.website)) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid URL",
        });
      }
    }
    const newOrg = await Org.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        org: newOrg,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getOrgs = async (req, res, next) => {
  try {
    const features = new APIFeatures(Org.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const orgs = await features.query.populate("parentOrg");

    res.status(200).json({
      status: "success",
      results: orgs.length,
      data: {
        orgs,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getOrg = async (req, res, next) => {
  try {
    const org = await Org.findById(req.params.id).populate("parentOrg");
    res.status(200).json({
      status: "success",
      data: {
        org,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
