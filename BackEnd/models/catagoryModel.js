const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
categoryName:{type:String},
categoryImage:{type:String},
categoryType:{type:String}

});

const catagoryModel = mongoose.model('catagory', categorySchema);

module.exports = catagoryModel;