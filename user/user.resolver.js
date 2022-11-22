const UserModel = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const {GraphQLError} = require('graphql');


const createUser = async function (parent, {user_input}, context){
    let permission = [];
    const permissionAdmin = [
        {
            name: "homepage",
            view: true
        },
        {
            name: "login",
            view: true
        },
        {
            name: "menu",
            view: true
        },
        {
            name: "cart",
            view: true
        },
        {
            name: "about",
            view: true
        },
        {
            name: "stock_management",
            view: true
        },
        {
            name: "menu_management",
            view: true
        }
    ];

    const permissionUser = [{
        name: "homepage",
        view: true
    },
    {
        name: "login",
        view: true
    },
    {
        name: "menu",
        view: true
    },
    {
        name: "cart",
        view: true
    },
    {
        name: "about",
        view: true
    },
    {
        name: "stock_management",
        view: false
    },
    {
        name: "menu_management",
        view: false
    }];

    if(user_input.role === 'ADMIN'){
        permission = permissionAdmin;
    }else{
        permission = permissionUser;
    }

    const user = await UserModel.findOne({email: user_input.email});
    if(user && user.user_status === 'ACTIVE'){
        throw new GraphQLError('Email telah digunakan', {
            extensions: {
                code: 404,
            }
        });
    } 
    if(user && user.user_status === 'DELETED'){
        const updateStatus = await UserModel.findOneAndUpdate({email: user_input.email}, {
            user_status: 'ACTIVE'
        }, {new: true});
        return updateStatus;
    }
    const hashed_password = await bcrypt.hash(user_input.password, 10);
    const newUser = new UserModel({
        first_name: user_input.first_name,
        last_name: user_input.last_name,
        email: user_input.email,
        hashed_password: hashed_password,
        user_status: user_input.status,
        role : user_input.role,
        user_type : permission
    });
    const result = await newUser.save();
    return result;
}

const loginUser = async (parent, {user_input}, context) => {
    const user = await UserModel.aggregate([{$match: {$and:[{email : user_input.email},{user_status : "ACTIVE"}]}}]);
    //check email
    if(user.length == 0){
        throw new GraphQLError('Email atau Password Salah', {
            extensions: {
                code: 401,
            }
        });
    }
    //check password
    const isPasswordValid = await bcrypt.compare(user_input.password, user[0].hashed_password);
    if(!isPasswordValid){
        throw new GraphQLError('Email atau Password Salah', {
            extensions: {
                code: 401,
            }
        });
    }
    const token = jwt.sign({
        id: user[0]._id, 
        role : user[0].role,
    }, 'secretbanget', {expiresIn: '1d'});
    return {
        user: user[0],
        token: token
    }
}

const updateUser = async (parent, {_id, user_input}, context) => {
    const user = await UserModel.findOne({_id: _id});
    if(!user){
        throw new GraphQLError('Email telah digunakan', {
            extensions: {
                code: 409,
            }
        });
    }
    if(user.status === 'DELETED'){
        throw new GraphQLError('User tidak ditemukan', {
            extensions: {
                code: 404,
            }
        });
    }
    const queryUpdate = {};
    if(user_input.password){
        user_input.hashed_password = await bcrypt.hash(user_input.password, 10);
        queryUpdate.hashed_password = user_input.hashed_password;
    }

    user_input.first_name ? queryUpdate.first_name = user_input.first_name : null;
    user_input.last_name ? queryUpdate.last_name = user_input.last_name : null;
    user_input.email ? queryUpdate.email = user_input.email : null;
    user_input.user_type ? queryUpdate.user_type = user_input.user_type : null;

    const result = await UserModel.findByIdAndUpdate(_id, queryUpdate, {new: true});
    return result;
}

const deleteUser = async (parent, {_id}, context) => {
    const user = await UserModel.findOne({_id: mongoose.Types.ObjectId(_id)});
    if(!user){
        throw new GraphQLError('User tidak ditemukan', {
            extensions: {
                code: 404,
            }
        });
    }
    user.user_status = 'DELETED';
    const result = await user.save();
    return result;
}

const getAllUsers = async (parent, {user_input}, context) => {
    let aggregate = [];
    let query = {$and: []};
    
    query.$and.push({user_status: {$eq: 'ACTIVE'}});

    user_input.first_name ? query.$and.push({first_name: user_input.first_name}) : null;
    user_input.last_name ? query.$and.push({last_name: user_input.last_name}) : null;
    user_input.email ? query.$and.push({email: user_input.email}) : null;
    
    aggregate.push({$match: query});
    
    if (user_input.page !== null) { 
        aggregate.push({$skip: user_input.page * user_input.limit});
    } else {
        throw new GraphQLError('Page harus diisi', {
            extensions: {
                code: 400,
            }
        });
    }

    if (user_input.limit !== null && user_input.limit > 0) {
        aggregate.push({$limit: user_input.limit});
    } else {
        throw new GraphQLError('Limit harus diisi dan lebih besar dari 0', {
            extensions: {
                code: 400,
            }
        });
    }

    try {
        const users = await UserModel.aggregate(aggregate);
        const total = users.length;
        if(users.length == 0){
            throw new GraphQLError('User tidak ditemukan', {
                extensions: {
                    code: 404,
                }
            });
        }
        return {
            users,
            total
        };
    } catch (error) {
        throw new Error(error);
    }
}

const getOneUser = async (parent, {_id, email}, context) => {
    let aggregate = [];
    let query = {$and: []};

    query.$and.push({user_status: {$ne: 'DELETED'}});

    _id ? query.$and.push({_id: mongoose.Types.ObjectId(_id)}) : null;
    email ? query.$and.push({email: email}) : null;
    aggregate.push({$match: query});
    try {
        const user = await UserModel.aggregate(aggregate);
        if(user.length == 0){
            throw new GraphQLError('User tidak ditemukan', {
                extensions: {
                    code: 404,
                }
            });
        }
        return user[0];
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    Query : {
        getAllUsers,
        getOneUser
    },
    Mutation : {
        createUser,
        loginUser,
        updateUser,
        deleteUser,
    }
}