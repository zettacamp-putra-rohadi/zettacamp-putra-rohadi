const ratingModel = require('./rating.model');
const mongoose = require('mongoose');
const {GraphQLError} = require('graphql');
const moment = require('moment');

const getAllRatings = async (parent, {page, limit, recipe_id}, context) => {
    let aggregate = [];

    if (recipe_id !== null) {
        aggregate.push(
            { $match : {recipe_id: mongoose.Types.ObjectId(recipe_id)} },
            { $sort : {rating_date: -1} },
        );
    } else {
        aggregate.push({ 
                $match : {user_id: mongoose.Types.ObjectId(context.user_id)},
            },
            { 
                $sort : {rating_date: -1} 
            },
            {
                $lookup: {
                    from: 'recipes',
                    localField: 'recipe_id',
                    foreignField: '_id',
                    as: 'recipe_data'
                }
            }
        );
    }

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
        return rating;
    } catch (error) {
        throw new GraphQLError('Rating not created', {
            extensions: {
                code: "rating/rating-not-created",
            }
        });
    }
}

module.exports = {
    Query: {
        getAllRatings,
    },
    Mutation: {
        createRating,
    }
};