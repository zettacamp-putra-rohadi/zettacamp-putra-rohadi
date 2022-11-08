const UserModel = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');


const createUser = async function (parent, {user_input}, context){
    const user = await UserModel.findOne({email: user_input.email});
    if(user){
        throw new Error('Email already exist');
    }
    const hashed_password = await bcrypt.hash(user_input.password, 10);
    const newUser = new UserModel({
        first_name: user_input.first_name,
        last_name: user_input.last_name,
        email: user_input.email,
        hashed_password: hashed_password
    });
    const result = await newUser.save();
    return result;
}

const loginUser = async (parent, {user_input}, context) => {
    const user = await UserModel.findOne({email: user_input.email});
    if(!user){
        throw new Error('Email not found');
    }
    const isPasswordValid = await bcrypt.compare(user_input.password, user.hashed_password);
    if(!isPasswordValid){
        throw new Error('Password is not valid');
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
}

const getAllUsers = async (parent, {user_input}, context) => {
    let aggregate = [];
    if(user_input.first_name){
        aggregate.push({
            $match: {
                first_name: user_input.first_name
            }
        });
    };
    if(user_input.last_name){
        aggregate.push({
            $match: {
                last_name: user_input.last_name
            }
        });
    };
    if(user_input.email){
        aggregate.push({
            $match: {
                email: user_input.email
            }
        });
    };
    try {
        const users = await UserModel.aggregate(aggregate);
        return users;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    Query : {
        getAllUsers,
    },
    Mutation : {
        createUser,
        loginUser,
    }
}