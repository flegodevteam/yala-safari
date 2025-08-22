const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  date: String,
  status: String,
  content: String,
  featuredImage: String,
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;  