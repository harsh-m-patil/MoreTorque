/**
 * Represents the features of the API
 * @class
 */
class APIFeatures {
  /**
   * Creates an instance of the class APIFeatures
   * @constructor
   * @param {mongoose.Query} query - The Mongoose query object.
   * @param {string} queryString - query string from the url
   */
  constructor(query, queryString) {
    /**
     * @type {mongoose.Query} - Mongoose query object
     */
    this.query = query;
    /**
     * @type {string} - query string from the url
     */
    this.queryString = queryString;
  }

  /**
   * Filter results provided by the API
   * Takes the filter fields from the query
   * @returns {APIFeatures} The instance of APIFeatures.
   */
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  /**
   * Sort the results provided by the API,
   * according to the string provided in the query
   * @returns {APIFeatures} The instance of APIFeatures.
   */
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query.sort("-createdAt");
    }
    return this;
  }

  /**
   * Limits the results provided by the API,
   * according to the string provided in the query
   * @returns {APIFeatures} The instance of APIFeatures.
   */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query.select("-__v");
    }
    return this;
  }

  /**
   * Provides pagination
   * according to the page and limit params from the queryString
   * @returns {APIFeatures} The instance of APIFeatures.
   */
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
