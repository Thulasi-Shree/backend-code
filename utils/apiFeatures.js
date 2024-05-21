class APIFeatures {
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
       let keyword =  this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
       }: {};

       this.query.find({...keyword})
       return this;
    }

    searchName() {
      let keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: 'i',
            },
          }
        : {};
  
      // Use the `find` method on `this.query` to apply the search condition
      this.query = this.query.find({ ...keyword });
      
    return this;
  }

    categoryFilter() {
        if (this.queryStr.mealTypeCategory) {
            this.query.where('mealTypeCategory').equals(this.queryStr.mealTypeCategory);
        }
        if (this.queryStr.dietaryPreferenceCategory) {
            this.query.where('dietaryPreferenceCategory').equals(this.queryStr.dietaryPreferenceCategory);
        }
        if (this.queryStr.isPreOrderAvailable !== undefined) {
            this.query.where('isPreOrderAvailable').equals(this.queryStr.isPreOrderAvailable);
        }
        if (this.queryStr.restaurantId) {
            this.query.where('restaurantId').equals(this.queryStr.restaurantId);
          }
          if (this.queryStr.userId) {
            this.query.where('userId').equals(this.queryStr.userId);
          }
        return this;
    }

    filter(){
        const queryStrCopy = { ...this.queryStr };
  
        //removing fields from query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach( field => delete queryStrCopy[field]);
        
        let queryStr = JSON.stringify(queryStrCopy);
        queryStr =  queryStr.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`)

        this.query.find(JSON.parse(queryStr));

        return this;
    }

    paginate(resPerPage) {
        const page = parseInt(this.queryStr.page, 10) || 1;
        const skip = (page - 1) * resPerPage;
    
        this.query = this.query.skip(skip).limit(resPerPage);
    
        return this;
      }
      sort() {
        if (this.queryStr.sort) {
          const sortFields = this.queryStr.sort.split(',');
      
          // Check if 'name' is present in sortFields
          const hasNameField = sortFields.some((field) => field === 'name');
          
          // If 'name' is present, use it for sorting
          if (hasNameField) {
            const sortOptions = sortFields.map((field) => {
              if (field === 'name') {
                return { [field]: 1 }; // Sorting by 'name' in ascending order
              } else if (field.startsWith('-')) {
                return { [field.substring(1)]: -1 }; // Descending order for other fields
              }
              return { [field]: 1 }; // Ascending order for other fields
            });
      
            // Apply sorting to the query
            this.query = this.query.sort(sortOptions);
          } else {
            // Default sorting logic if 'name' is not present
            this.query = this.query.sort('createdAt');
          }
        } else {
          // Default sorting logic if no specific sort is provided
          this.query = this.query.sort('createdAt');
        }
      
        return this;
      }
      
      
}

module.exports = APIFeatures;