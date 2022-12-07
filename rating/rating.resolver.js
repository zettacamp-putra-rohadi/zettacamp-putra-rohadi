const ratingModel = require('./rating.model');
const transactionModel = require('../transaction/transaction.model');
const mongoose = require('mongoose');
const {GraphQLError} = require('graphql');
const moment = require('moment');

const getAllRatings = async (parent, {page, limit, recipe_id}, context) => {
    let aggregate = [];

    if (recipe_id) {
        aggregate.push({ $match : {recipe_id: mongoose.Types.ObjectId(recipe_id)} }
        );
    } else {
        aggregate.push({ $match : {user_id: mongoose.Types.ObjectId(context.user_id)} }
        );
    }

    aggregate.push({ $sort : {createdAt: -1} });

    //count total rating data
    const total = await ratingModel.aggregate(aggregate).count('total');

    if (page !== null) { 
        aggregate.push({$skip: page * limit});
    } else {
        throw new GraphQLError('Page required', {
            extensions: {
                code: "rating/page-required",
            }
        });
    }

    if (limit !== null && limit > 0) {
        aggregate.push({$limit: limit});
    } else {
        throw new GraphQLError('Limit is required and greater than 0', {
            extensions: {
                code: "rating/limit-required",
            }
        });
    }

    try{
        const listRating = await ratingModel.aggregate(aggregate);
        console.log(listRating);
        if(listRating.length == 0){
            throw error;
        }
        return {
            listRating,
            total : total[0].total
        }

    } catch (error) {
        throw new GraphQLError('Rating not found', {
            extensions: {
                code: "rating/rating-not-found",
            }
        });
    }
}

const createRating = async (parent, input, context) => {
    for (data of input.input){
        data.user_id = context.user_id;
        data.rating_date = moment().locale('id').format('LL');
    }
    try {
        const rating = await ratingModel.insertMany(input.input);
        const updateTransaction = await transactionModel.findByIdAndUpdate(input.input[0].transaction_id, {rating_status: true});
        return rating;
    } catch (error) {
        throw new GraphQLError('Rating not created', {
            extensions: {
                code: "rating/rating-not-created",
            }
        });
    }
}

const getRecipeLoader = async (parent, args, context) => {
    if(parent.recipe_id){
        const recipe = await context.ratingRecipeLoader.load(parent.recipe_id);
        return recipe;
    }
}

module.exports = {
    Query: {
        getAllRatings,
    },
    Mutation: {
        createRating,
    },
    Rating: {
        recipe_id: getRecipeLoader,
    }
};