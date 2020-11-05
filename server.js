const mongoose = require('mongoose')
const express = require('express')

const User = require('./models/user')
const Post = require('./models/post')

const app = express()

app.use(express.json())

// CREATE
app.post('/users', async (req, res) => {
  const { name, email, role } = req.body

  try {
    const user = await User.create({ name, email, role })

    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

// READ
app.get('/users', async (req, res) => {
  try {
    const users = await User.find()

    return res.json(users)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

// UPDATE
app.put('/users/:id', async (req, res) => {
  const id = req.params.id
  const { name, email, role } = req.body
  try {
    const user = await User.findById(id).orFail()

    user.name = name || user.name
    user.email = email || user.email
    user.role = role || user.role

    await user.save()

    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

// DELETE
app.delete('/users/:id', async (req, res) => {
  const id = req.params.id

  try {
    await User.findByIdAndDelete(id).orFail()

    return res.json({ message: 'User deleted successfully' })
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

// FIND
app.get('/users/:id', async (req, res) => {
  const id = req.params.id

  try {
    const user = await User.findById(id).orFail()

    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ error: 'User not found' })
  }
})

// Create a Post
app.post('/posts', async (req, res) => {
  const { userId, body, title } = req.body

  try {
    const user = await User.findById(userId).orFail()

    const post = await Post.create({
      title,
      body,
      user: user.id,
    })

    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
})

// Read (get all posts)
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', '-email -_id')

    return res.json(posts)
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
})

app.listen(5000, () => {
  console.log('Server up on http://localhost:5000')
  mongoose
    .connect('mongodb://localhost:27017/mongo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Database Connected'))
    .catch((err) => console.log(err))
})
