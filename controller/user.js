const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();
const User = require('../model/User');


const jwtSecret = process.env.JWT_SECRET;

const register = async (req, res) => {

    const {
        username,
        password
    } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const createUser = await User.create({
            username: username,
            password: hashedPassword
        });
        jwt.sign({
            userId: createUser._id,
            username
        }, jwtSecret, {
            expiresIn: '2h'
        }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, {
                sameSite: 'none',
                secure: true
            }).status(201).json({
                id: createUser._id,
            });
        });
    } catch (err) {
        res.status(400).json(err)
    }

}

const login = async (req, res) => {
    const {
        username,
        password
    } = req.body;

    try {
        const foundUser = await User.findOne({
            username
        });

        if (foundUser) {
            const passOk = await bcrypt.compare(password, foundUser.password)

            if (passOk) {
                jwt.sign({
                    userId: foundUser._id,
                    username
                }, jwtSecret, {
                    expiresIn: '2h'
                }, (error, token) => {
                    res.cookie('token', token, {
                        sameSite: 'none',
                        secure: true
                    }).json({
                        id: foundUser._id
                    })
                })
            }

        } else {
            res.status(401).json({
                message: 'unauthorised'
            })
        }

    } catch (err) {
        res.status(401).json({
            message: 'Unauthorised'
        })
    }




}

const logout = async (req, res) => {
    res.cookie('token', '', {
        sameSite: 'none',
        secure: true
    }).status(200).json('ok');
}

const profile = async (req, res) => {


    if (req.cookies && req.cookies.token) {
        const token = req.cookies.token;
        jwt.verify(token, jwtSecret, {}, (err, userData) => {
            if (err) {
                throw err
            }
            res.json(userData)
        })
    } else {
        res.status(401).json({
            message: 'Unauthorised'
        })
    }
}

module.exports = {
    register,
    login,
    logout,
    profile
};