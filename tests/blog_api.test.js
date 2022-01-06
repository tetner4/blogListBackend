const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


beforeEach(async () => {
    await User.deleteMany({})
    

    const passwordHash = await bcrypt.hash('salasana', 10)
    const user = new User({ username: 'root', name: 'Master User', password: passwordHash })


    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})   

test('return correct amount of blog posts in json', async () => {
  const response = await api
  .get('/api/blogs')
  .expect(200)
  .expect('Content-Type',  /application\/json/)

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('verify that a ID field is present', async () => {
 const response = await api.get(`/api/blogs/`)

  expect(response.body[0].id).toBeDefined()
})

test('verifiy that POST URL successfully createa a new blog post', async () => {
  const testBlog = {
    _id: "4a111a851b54a676234d17f7", 
    title: "The good stuff", 
    author: "Mike Green", 
    url: "https://thegoodstuff.com/", 
    likes: 45, __v: 0 
  }
  await api
  .post('/api/blogs')
  .send(testBlog)
  .expect(200)
  .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
})

test('if likes property is missing from the request set to 0', async () => {
  const testBlog = {
    _id: "4a111a851b54a676234d17f7", 
    title: "The good stuff", 
    author: "Mike Green", 
    url: "https://thegoodstuff.com/" 
  }

  const response = await api
  .post('/api/blogs')
  .send(testBlog)
  
  expect(response.body.likes).toBe(0)
})

test('if title and URL properties are missing from request, backend responds with status code 400', async () => {
  const testBlog = {
  _id: "4a111a851b54a676234d17f7", 
  author: "Mike Green", 
}

const response = await api
.post('/api/blogs')
.send(testBlog)

expect(response.status).toBe(400)

})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

afterAll(() => {
  mongoose.connection.close()
})
