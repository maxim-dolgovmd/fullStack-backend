import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

import UserModal from '../models/User.js'

export const register = async (req, res) => {

    try {

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = UserModal({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatar
        })

        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id
        }, 
            'secret563',
        {
            expiresIn: '30d'
        }
        )

        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData, 
            token,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось зарегестрироваться'
        })
    }
}

export const login = async (req, res) => {

    try {
        
        const user = await UserModal.findOne({email: req.body.email})

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign(
            {
                _id: user._id,
            }, 
                'secret563',
            {
                expiresIn: '30d'
            }
        )

        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData, 
            token,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось атворизоваться'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModal.findById(req.userId)

        if (!user) [
            res.status(404).json({
                message: 'Пользователь не найден'
            })
        ]

        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Пользователь не найден'
        })
    }
}