const Category = require('../model/Category');
const AppError = require('../error/appError');
const ResponseBuilder = require('../util/responseBuilder');
const { categorySchema } = require('../validation/category.validation');

exports.createCategory = async (req, res, next) => {
    try {

        const { error } = categorySchema.validate(req.body);
        if (error) return next(new AppError(error.details[0].message, 400));

        const category = await Category.create(req.body);

        const response = new ResponseBuilder(res);
        response.setStatus(201);
        response.buildResponse({
            message: "Category created",
            data: category
        });

    } catch (err) { next(err); }
};

exports.getAllCategories = async (req, res, next) => {
    try {

        const categories = await Category
            .find({ isDeleted: false })
            .lean();

        const response = new ResponseBuilder(res);
        response.setStatus(200);
        response.buildResponse({
            message: "Categories fetched",
            data: categories
        });

    } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
    try {

        const { error } = categorySchema.validate(req.body);
        if (error) return next(new AppError(error.details[0].message, 400));

        const category = await Category.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );

        if (!category)
            return next(new AppError("Category not found", 404));

        const response = new ResponseBuilder(res);
        response.setStatus(200);
        response.buildResponse({
            message: "Category updated",
            data: category
        });

    } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
    try {

        const category = await Category.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );

        if (!category)
            return next(new AppError("Category not found", 404));

        const response = new ResponseBuilder(res);
        response.setStatus(200);
        response.buildResponse({
            message: "Category deleted"
        });

    } catch (err) { next(err); }
};