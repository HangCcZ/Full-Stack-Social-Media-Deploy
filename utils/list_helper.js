const { groupBy, map } = require('lodash')
const _ = require('lodash')

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

const totalLikes = (blogs) => {
  const reducer = (accumulator, currentValue) =>
    accumulator + currentValue.likes
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  return _.maxBy(blogs, (o) => o.likes)
}

const mostBlogs = (blogs) => {
  const grouped = _.countBy(blogs, 'author')
  let newEntries = []
  for (const [key, val] of Object.entries(grouped)) {
    newEntries = newEntries.concat([{ author: key, blogs: val }])
  }
  console.log(_.maxBy(newEntries, 'count'))
}

//@todo
const mostLikes = (blogs) => {
  let blogMap = new Map()
  let blogArr = []
  // convert blogs into a map that maps author:likes
  for (blog of blogs) {
    if (blogMap.has(blog.author)) {
      blogMap.set(blog.author, blogMap.get(blog.author) + blog.likes)
    } else {
      blogMap.set(blog.author, blog.likes)
    }
  }
  for (let [author, likes] of blogMap.entries()) {
    blogArr = blogArr.concat({ author, likes })
  }
  return _.maxBy(blogArr, 'likes')
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostLikes,
}
