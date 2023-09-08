import {body} from 'express-validator'

export const authValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 6 символов').isLength({min: 6}),
]

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 6 символов').isLength({min: 6}),
    body('fullName', 'Имя должно быть минимум 3 символа').isLength({min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL()
]

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи').isLength({min: 3}).isString(),
    body('tags', 'Неверный формат тегов(укажите массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString()
]

export const сreateComment = [
    body('text', 'Введите текст комментария').isLength({min: 3}).isString(),
    body('paramsId', 'id статьи не указан').isLength({min: 3}).isString()
]