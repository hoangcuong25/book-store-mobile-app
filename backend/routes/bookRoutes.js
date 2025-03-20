import express from 'express'
import { v2 as cloudinary } from 'cloudinary'
import Book from '../models/Book.js'
import protectRoute from '../middleware/auth.js'

const router = express.Router()

router.post('/', protectRoute, async (req, res) => {
    try {
        const { title, caption, rating, image } = req.body

        if (!image || !title || !caption || !rating) {
            return res.json({ message: 'please provide all fileds' })
        }

        const uploadRes = await cloudinary.uploader.upload(image)
        const imageUrl = uploadRes.secure_url

        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id
        })

        await newBook.save()

        res.json(newBook)

    } catch (error) {
        console.log(error)
    }
})

router.get('/', protectRoute, async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 5
        const skip = (page - 1) * limit

        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('user', 'username profileImage')

        const totalBooks = await Book.countDocuments()

        res.send({
            books,
            currentPage: page,
            totalBooks: totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        })

    } catch (error) {
        console.log(error)
    }
})

router.get('/user', protectRoute, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 })
        res.json(books)
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:id', protectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        if (!book) return res.json({ message: 'Book not found' })

        if (book.user.toString() !== req.user._id.toString())
            return res.json({ message: 'unauth' })

        if (book.image && book.image.includes('cloudinary')) {
            try {
                const publicId = book.image.split('/').pop().split('.')[0]

                await cloudinary.uploader.destroy(publicId)

            } catch (error) {
                console.log(error)
            }
        }

        await book.deleteOne()

        res.json({ message: 'Book deleted' })

    } catch (error) {
        console.log(error)
    }
})

export default router