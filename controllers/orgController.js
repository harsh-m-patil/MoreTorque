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
    const org = await Org.findById(req.params.id)
      .populate("parentOrg")
      .populate("childrenOrgs");
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

const propagatePolicies = async (org, updates) => {
  const childrenOrgs = await Org.find({ parentOrg: org._id });

  if (!childrenOrgs) {
    return;
  }

  childrenOrgs.forEach(async (child) => {
    let updateChild = false;
    // update all childs
    if (updates.fuelReimbursementPolicy) {
      child.fuelReimbursementPolicy = updates.fuelReimbursementPolicy;
      updateChild = true;
    }

    // update those childs who do not have a speedLimitPolicy
    if (updates.speedLimitPolicy && !child.speedLimitPolicy) {
      child.speedLimitPolicy = updates.speedLimitPolicy;
      updateChild = true;
    }

    // if child is update its child
    if (updateChild) {
      await child.save();
      await propagatePolicies(child, updates);
    }
  });
};

exports.updateOrg = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const org = await Org.findById(id).populate("parentOrg");

    if (!org) {
      return res.status(404).send({ error: "Organization not found" });
    }

    if (updates.fuelReimbursementPolicy) {
      // check if fuel policy is set by parent
      if (
        org.parentOrg &&
        org.fuelReimbursementPolicy === org.parentOrg.fuelReimbursementPolicy
      ) {
        return res.status(400).send({
          error:
            "Cannot update inherited fuelReimbursementPolicy, update at the parent level",
        });
      }
      // else update
      org.fuelReimbursementPolicy = updates.fuelReimbursementPolicy;
    }

    // update no restrictions
    if (updates.speedLimitPolicy) {
      org.speedLimitPolicy = updates.speedLimitPolicy;
    }
    if (updates.account) org.account = updates.account;
    if (updates.website) org.website = updates.website;

    await org.save();

    if (updates.fuelReimbursementPolicy || updates.speedLimitPolicy) {
      await propagatePolicies(org, updates);
    }

    res.status(200).send(org);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};
