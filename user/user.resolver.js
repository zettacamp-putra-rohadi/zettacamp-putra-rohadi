const UserModel = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const loginUser = async function (parent, {user_input},context){
    const user = await UserModel.findOne({email: user_input.email});
    if(!user){
        throw new Error('User not found');
    }
    const isPasswordValid = await bcrypt.compare(user_input.password, user.hashed_password);
    if(!isPasswordValid){
        throw new Error('Password is invalid');
    }
    const token = jwt.sign({
        id: user._id, 
        email:user.email, 
        password:user_input.password
    }, 'secretbanget', {expiresIn: '1h'});
    return {
        id: user._id,
        email: user.email,
        token: token
    }
};

const insertUser = async function (parent, {user_input}, context){
    const user = await UserModel.findOne({email: user_input.email});
    if(user){
        throw new Error('Email already exist');
    }
    const hashed_password = await bcrypt.hash(user_input.password, 10);
    const newUser = new UserModel({
        name: user_input.name,
        email: user_input.email,
        hashed_password: hashed_password
    });
    const result = await newUser.save();
    return result;
}

// const editUser = async function (parent, {id, user_input}, context){
//     const user = await UserModel.findOne({_id : id});
//     if(!user){
//         throw new Error('User not found');
//     } else {
        
//         const hashed_password = await bcrypt.hash (user_input.password, 10);
//         const name = user_input.name
//         const result = await UserModel.updateOne({_id: id}, {$set: {
//              name ? {name: user_input.name} : {}
            
//             hashed_password: hashed_password
//         }});
//         return result;
//     }
// }

const getAllUsers = async function (parent, {page, limit}, context){
    if(!page || !limit){
        const users = await UserModel.find();
        const count = await UserModel.countDocuments();
        return {
            users: users,
            count: count
        }
    } else{
        const skip = page * limit;
        const users = await UserModel.aggregate([
            {$skip: skip},
            {$limit: limit},
            {$project: {hashed_password: 0}}
            ]);
        const count = await UserModel.countDocuments();
        return {
            users: users,
            count: count
        }
    }
}

const getUserById = async function (parent, {user_input}, context){
    const user = await UserModel.findById(user_input.user_id);
    if(!user){
        throw new Error('User not found');
    }
    return user;
}

module.exports = {
    Query : {
        getAllUsers,
        getUserById
    },
    Mutation : {
        loginUser,
        insertUser,
        // editUser
    }
}