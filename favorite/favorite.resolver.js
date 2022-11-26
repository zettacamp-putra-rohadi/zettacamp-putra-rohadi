const favoriteModel = require('./favorite.model');
const mongoose = require('mongoose');
const {GraphQLError} = require('graphql');

const getAllFavorites = async (parent, {page, limit}, context) => {
    let aggregate = [];
    let aggregateCount = [];

    if (context.role !== 'ADMIN') {
        aggregateCount.push({ 
            $match : { $and: [
                {user_id: mongoose.Types.ObjectId(context.user_id)},
                {favorite_status: {$eq: 'ACTIVE'}}
            ] }
        });
    } else {
        aggregateCount.push({ 
            $match : { $and: [
                {favorite_status: {$eq: 'ACTIVE'}}
            ] }
        });
    }

    aggregate.push(aggregateCount[0]);
    if (page !== null) { 
        aggregate.push({$skip: page * limit});
    } else {
        throw new GraphQLError('Page required', {
            extensions: {
                code: "favorite/page-required",
            }
        });
    }

    if (limit !== null && limit > 0) {
        aggregate.push({$limit: limit});
    } else {
        throw new GraphQLError('Limit is required and greater than 0', {
            extensions: {
                code: "favorite/limit-required",
            }
        });
    }
    
    const total = await favoriteModel.aggregate(aggregateCount).count('total');
    try{
        const listFavorite = await favoriteModel.aggregate(aggregate);
        if(listFavorite.length == 0){
            throw error;
        }
        return {
            listFavorite,
            total : total[0].total
        }
    }   catch (error) {
        throw new GraphQLError('Favorite not found', {
            extensions: {
                code: "favorite/favorite-not-found",
            }
        });
    }
}

const getOneFavorite = async (parent, {_id}, context) => {
    try {
        const favorite = await favoriteModel.aggregate([
            {
                $match: { $and : [
                    {_id: mongoose.Types.ObjectId(_id)}, 
                    {favorite_status : "ACTIVE"}
                ] }
            }
        ]);
        if(!favorite){
            throw error;
        }
        console.log(favorite[0]);
        return favorite[0];
    } catch (error) {
        throw new GraphQLError('Favorite not found', {
            extensions: {
                code: "favorite/favorite-not-found",
            }
        });
    }
}

const createFavorite = async (parent, {recipe_id}, context) => {
    const newFavorite = new favoriteModel({
        user_id: context.user_id,
        recipe_id: recipe_id,
        favorite_status: 'ACTIVE'
    });

    const result = await newFavorite.save();
    return result;
}

const deleteFavorite = async (parent, {_id}, context) => {
    try {
        const result = await favoriteModel.findOneAndUpdate({_id: _id}, {
            favorite_status: 'DELETED'
        }, {new: true});
        return result;
    } catch (error) {
        throw new GraphQLError('Favorite not found', {
            extensions: {
                code: "favorite/favorite-not-found",
            }
        });
    }
}

module.exports = {
    Query : {
        getAllFavorites,
        getOneFavorite,
    },
    Mutation : {
        createFavorite,
        deleteFavorite,
    }
}