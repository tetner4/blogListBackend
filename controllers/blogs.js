const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, _id: 1})
    response.json(blogs.map(blog => blog.toJSON()))
  })

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog.toJSON())
    } else {
      response.status(404).end()
    }
  })

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  
    if (!request.token || !request.decodedToken) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(request.decodedToken.id)
    

    if ( body.likes ==='undefined' || body.likes===null ){
      body.likes = 0
    }

    if (body.title === 'undefined' || body.title === null 
      || body.url === 'undefined' || body.url === null) {
      response.status(400).end()
  }
    else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes, 
      user: user._id })
      
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedNote._id)
    await user.save()
    response.status(201).json(savedBlog.toJSON())
  }
    
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if(!request.token || !request.decodedToken){
    return response.status(401).json({error: 'token missing or invalid'})
  }
  const blog = await Blog.findById(request.params.id)
  if(blog.user.toString() === request.decodedToken.id.toString()){
    await Blog.findByIdAndDelete(request.params.id) 
    response.status(204).end

  } else {
    response.status(400).end()
  }
})

blogsRouter.put('/:id', async (request,response) => {
  const blog  = {
   likes: request.body.likes
  }
  const result = await Blog.findByIdAndUpdate(
    request.params.id, 
    blog,
    {new:true}
  )
  const savedBlog = await result.save()
  response.json(savedBlog.toJSON())
  response.status(400).end()
})
  






module.exports = blogsRouter