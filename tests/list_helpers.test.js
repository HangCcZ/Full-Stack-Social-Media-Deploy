const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')

const api = supertest(app)

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]
describe('total likes', () => {
  test('total likes from all blogs', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe('favorite blogs', () => {
  test(' most like is Canonical string reduction', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(blogs[2])
  })
})

describe('most likes', () => {
  test('most likes from all blogs', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})

describe('api test', () => {
  test('get request', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(1)
  })
})

describe('verifying existence of properties', () => {
  test('verify existence of id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('vetify if likes property is missing from the request, the default value should be 0', async () => {
    const newBlog = {
      title: 'Third Story',
      author: 'Hang',
      url: 'google.com',
    }

    const postResponse = await api.post('/api/blogs').send(newBlog)
    expect(postResponse.body.likes).toBe(0)
  })
})

describe('verifying HTTP POST', () => {
  test('success: verify total number of blogs increased by one after POST', async () => {
    const newBlog = {
      title: 'New Third Story',
      author: 'Hang',
      url: 'google.com',
      likes: 666,
    }

    await api
      .post('/api/blogs')
      .set(
        'Authorization',
        'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhbmciLCJpZCI6IjVmODQ4YzAzMjdkMzljMTkwNGY4OGFkOSIsImlhdCI6MTYwMjUyNjE1Mn0.t_7_Xo-ie1GNS7RPVaEq2sck3GCTHH-FyZGuy2ApjJM'
      )
      .send(newBlog)

    const postResponse = await api.get('/api/blogs')
    const contents = postResponse.body.map((r) => r.title)
    expect(contents).toContain('New Third Story')
  })

  test('fail: test fail when token is not provided in the header', async () => {
    const newBlog = {
      title: 'New Third Story',
      author: 'Hang',
      url: 'google.com',
      likes: 666,
    }

    await api.post('/api/blogs').send(newBlog).expect(401)
  })

  test('verifies that if the title and url properties are missing from request,backend respond 400 Bad request', async () => {
    const newBlog = {
      author: 'Hang',
      likes: 666,
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeed with status code 204 if id is valid', async () => {
    const blogAtStart = (await api.get('/api/blogs')).body
    const blogToDelete = blogAtStart[1]

    await api.delete(`/api/blogs/${blogToDelete.id}`)

    const blogsAtEnd = (await api.get('/api/blogs')).body

    expect(blogsAtEnd).toHaveLength(blogAtStart.length - 1)

    const blogTitles = blogsAtEnd.map((b) => b.title)
    expect(blogTitles).not.toContain(blogToDelete.title)
  })
})

describe('update of a blog', () => {
  test('increase a blog likes count by one', async () => {
    const blogAtStart = (await api.get('/api/blogs')).body
    const blogToUpdate = blogAtStart[blogAtStart.length - 1]

    const blog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
    }
    const newBlog = await api.put(`/api/blogs/${blogToUpdate.id}`).send(blog)
    expect(newBlog.body.likes).toBe(blogToUpdate.likes + 1)
  })
})

afterAll((done) => {
  mongoose.connection.close()
  done()
})
