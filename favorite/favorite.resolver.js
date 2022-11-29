const favoriteModel = require('./favorite.model');
const mongoose = require('mongoose');
const {GraphQLError} = require('graphql');

const getAllFavorites = async (parent, {page, limit}, context) => {
    let aggregate = [];

    aggregate.push({ 
        $match : { $and: [
            {user_id: mongoose.Types.ObjectId(context.user_id)},
            {favorite_status: {$eq: 'ACTIVE'}}
        ] }
    });
    
    const total = await favoriteModel.aggregate(aggregate).count('total');
    
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
        const favorite = await favoriteModel.findOne({_id: _id, favorite_status: 'ACTIVE'});
        if(!favorite){
            throw error;
        }

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

const getRecipeLoader = async (parent, args, context) => {
    if(parent.recipe_id){
        const recipe = await context.favoriteRecipeLoader.load(parent.recipe_id);
        recipe.is_favorite = true;
        return recipe;
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
    },
    Favorite : {
        recipe_id: getRecipeLoader
    }
}