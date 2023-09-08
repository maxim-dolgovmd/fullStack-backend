import commentShema from '../models/Comment.js'

export const createComment = async (req, res) => {
    try {
        
        const doc = commentShema({
            text: req.body.text,
            paramsId: req.body.paramsId,
            user: req.userId,
        })

        const comment = await doc.save()

        console.log(comment)

        res.json({
            comment
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Не удалось создать комментарий'
        })
    }
}

export const getCommentAll = async (req, res) => {
    try {
        
        const comment = await commentShema.find().populate('user').exec()

        res.json(comment)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Не удалось получить комментарии'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        
        const id = req.params.id
        const comment = await commentShema.find({paramsId: id}).populate('user').exec()

        console.log(comment)
        res.json(comment)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Не удалось получить комментарии'
        })
    }
}