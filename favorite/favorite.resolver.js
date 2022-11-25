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
        throw new GraphQLError('Page harus diisi', {
            extensions: {
                code: 400,
            }
        });
    }

    if (limit !== null && limit > 0) {
        aggregate.push({$limit: limit});
    } else {
        throw new GraphQLError('limit harus diisi dan lebih dari 0', {
            extensions: {
                code: 400,
            }
        });
    }
    
    const total = await favoriteModel.aggregate(aggregateCount).count('total');
    const listFavorite = await favoriteModel.aggregate(aggregate);
    return {
        listFavorite,
        total : total[0].total
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
        throw new GraphQLError('Favorite Tidak Ditemukan', {
            extensions: {
                code: 404,
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
        throw new GraphQLError('Favorite Tidak Ditemukan', {
            extensions: {
                code: 404,
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