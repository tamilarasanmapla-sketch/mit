class ApiFilter {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          productName: {
            $regex: this.queryStr.keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryStr };
    //remove field from query
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((field) => delete queryCopy[field]);
    // Convert query object to string
    let queryStr = JSON.stringify(queryCopy);

    // Replace operators (gte → $gte)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    // Convert back to object
    const parsedQuery = JSON.parse(queryStr);

    this.query = this.query.find(parsedQuery);
    return this;
  }
  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFilter;
