const express= require('express')
const catagoryRouter= express.Router()
const categoryController = require('../components/catagoryComponent');
const authenticateAdmin = require('../middleware/adminMiddleware');

catagoryRouter.post('/add_catagory',authenticateAdmin, categoryController.addCategory);
catagoryRouter.post('/all_catagory', categoryController.getAllCategories);
catagoryRouter.post('/delete_catagory',authenticateAdmin, categoryController.deleteCategory);
catagoryRouter.put('/update',authenticateAdmin, categoryController.updateCategory);
catagoryRouter.get('/:id',authenticateAdmin, categoryController.getCategoryById);

module.exports=catagoryRouter

