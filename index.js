import express from 'express';
import mongoose from 'mongoose'
import multer from 'multer';
import cors from 'cors'

import {handleValidationErrors, checkAuth} from './utils/index.js';

import { registerValidation, authValidation, postCreateValidation, сreateComment } from './validations.js';
import {userController, postController, commentController} from './controller/index.js'


mongoose
    .connect('mongodb+srv://admin:mmmmmm@cluster0.rqgvfch.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err))

const app = express()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login',authValidation, handleValidationErrors, userController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, userController.register)
app.get('/auth/me', checkAuth, userController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/tags', postController.getLastTags)
app.get('/tags/:id', postController.getTegs)

app.post('/comments', checkAuth, сreateComment, handleValidationErrors, commentController.createComment)
app.get('/comments', commentController.getCommentAll)
app.get('/comments/:id', commentController.getOne)


app.get('/posts', postController.getAll)
app.get('/posts/tags', postController.getLastTags)
app.get('/posts/:id', postController.getOne)
app.post('/posts', checkAuth, postCreateValidation,handleValidationErrors, postController.create)
app.delete('/posts/:id', checkAuth, postController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation,handleValidationErrors, postController.update)
app.patch('/posts/:id', checkAuth,postCreateValidation,handleValidationErrors, postController.updateCount)


app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server OK')
})

