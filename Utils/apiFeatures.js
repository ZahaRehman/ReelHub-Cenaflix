class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    filter() {
        // Convert the query object to a string
        let querystring = JSON.stringify(this.queryStr);
        // Replace operators with MongoDB operators (e.g., gte -> $gte)
        querystring = querystring.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        // Parse the string back into an object
        const queryOBJ = JSON.parse(querystring); // Fixed: used 'querystring'
        delete queryOBJ.sort;
        delete queryOBJ.fields;
        delete queryOBJ.page;
        delete queryOBJ.limit;

        this.query = this.query.find(queryOBJ);
        return this;
    }

    sort() {
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('duration');
        }
        return this;
    }

    limitFields() {
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    pagination() {
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 2;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = ApiFeatures;
