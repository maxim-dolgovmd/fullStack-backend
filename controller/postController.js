import PostShema from '../models/Post.js'



export const getLastTags = async (req, res) => {
    try {
        
        const posts = await PostShema.find().limit(5).exec()

        const tags = posts.map((obj) => obj.tags).flat().slice(0, 5)

        res.json(tags)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Не удалось получить теги'
        })
    }
}

export const getTegs = async (req, res) => {
    try {

        const tagsId = req.params.id
        
        const posts = await PostShema.find().populate('user').exec()
        const tags = posts.filter((obj) => obj.tags.includes(tagsId))

        res.json(tags)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Не удалось получить теги'
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const {sort} = req.query
        // console.log(sort)
        let posts

        switch (sort) {
            case 'createdAt': 
                posts = await PostShema.find().populate('user').sort({createdAt:-1}).exec()
                break;

            case 'viewsCount': 
                posts = await PostShema.find().populate('user').sort({viewsCount:-1}).exec()
                break;
        
            default:
                posts = await PostShema.find().populate('user').exec()
                break;
        } 

        res.json(posts)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        
        const postId = req.params.id

        const post = await PostShema.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc:  {viewsCount: 1},
            },
            {
                returnDocument: 'after',
            }
        ).populate('user')

        if (!post) {
            res.status(404).json({
                message: 'Статья отсутствует'
            })
        }

        res.json(post)

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Не удалось найти статью'
        })
    }
}

export const remove = async (req, res) => {
    try {
        
        const post = req.params.id

        const remove = await PostShema.findByIdAndDelete(post)

        if (!remove) {
            res.status(404).json({
                message: 'Статья не найдена'
            })    
        } else {
            res.json({
                success: true
            })
        }


    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Не удалось удалить статью'
        })
    }
}

export const update = async (req, res) => {
    try {
        
        const post = req.params.id

        await PostShema.updateOne(
            {
                _id: post
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
                count: req.body.count,
                viewsCount: req.body.viewsCount,
            }
        )

        res.json({
            success: true
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
}

export const updateCount = async (req, res) => {
    try {
        
        const post = req.params.id

        await PostShema.updateOne(
            {
                _id: post
            },
            {
                count: req.body.count,
            }
        )

        res.json({
            success: true
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось обновить значение count в статье'
        })
    }
}

export const create = async (req, res) => {
    try {
        
        const doc = PostShema({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            count: req.body.count,
            user: req.userId,
            viewsCount: req.body.viewsCount,
        })

        const post = await doc.save()

        res.json({
            post
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
}