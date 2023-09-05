const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    }
});

const subCategory = mongoose.model('subCategory', subCategorySchema);

module.exports = subCategory;