import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Best Time to Visit Yala National Park",
      excerpt: "Learn about the optimal seasons for wildlife spotting in Yala and what you can expect to see during different times of the year.",
      date: "May 15, 2023",
      category: "Travel Tips",
      image: "/blog1.jpg",
      readTime: "4 min read"
    },
    {
      id: 2,
      title: "Leopard Spotting Guide for Yala",
      excerpt: "Our expert guides share their top tips for spotting leopards during your safari adventure in Yala National Park.",
      date: "April 28, 2023",
      category: "Wildlife",
      image: "/blog2.jpg",
      readTime: "6 min read"
    },
    {
      id: 3,
      title: "Conservation Efforts in Sri Lanka's National Parks",
      excerpt: "How Sri Lanka is working to protect its incredible biodiversity and what visitors can do to support these efforts.",
      date: "March 10, 2023",
      category: "Conservation",
      image: "/blog3.jpg",
      readTime: "8 min read"
    },
    {
      id: 4,
      title: "Photography Tips for Safari Enthusiasts",
      excerpt: "Capture stunning wildlife photos with these professional tips on equipment, settings, and techniques for safari photography.",
      date: "February 22, 2023",
      category: "Photography",
      image: "/blog4.jpg",
      readTime: "5 min read"
    },
    {
      id: 5,
      title: "Family-Friendly Safari Tips",
      excerpt: "Everything you need to know to plan a successful safari adventure with children of all ages.",
      date: "January 15, 2023",
      category: "Family Travel",
      image: "/blog5.jpg",
      readTime: "7 min read"
    },
    {
      id: 6,
      title: "Birdwatching in Bundala National Park",
      excerpt: "A comprehensive guide to the incredible bird species you can spot in Bundala, one of Sri Lanka's premier birdwatching destinations.",
      date: "December 5, 2022",
      category: "Birdwatching",
      image: "/blog6.jpg",
      readTime: "9 min read"
    }
  ];

  const categories = [
    { name: "All", count: blogPosts.length },
    { name: "Travel Tips", count: blogPosts.filter(post => post.category === "Travel Tips").length },
    { name: "Wildlife", count: blogPosts.filter(post => post.category === "Wildlife").length },
    { name: "Conservation", count: blogPosts.filter(post => post.category === "Conservation").length },
    { name: "Photography", count: blogPosts.filter(post => post.category === "Photography").length },
    { name: "Family Travel", count: blogPosts.filter(post => post.category === "Family Travel").length },
    { name: "Birdwatching", count: blogPosts.filter(post => post.category === "Birdwatching").length }
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = activeCategory === "All" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Safari Blog & Tips
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Expert advice, wildlife insights, and travel tips for your perfect safari experience.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm ${activeCategory === category.name ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <div key={post.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
            <div className="flex-shrink-0">
              <img className="h-48 w-full object-cover" src={post.image} alt="" />
            </div>
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-green-600">
                  {post.category}
                </p>
                <Link to={`/blog/${post.id}`} className="block mt-2">
                  <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                  <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                </Link>
              </div>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 text-sm font-medium">YL</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Yala Safari Team
                  </p>
                  <div className="flex space-x-1 text-sm text-gray-500">
                    <time dateTime="2020-03-16">{post.date}</time>
                    <span aria-hidden="true">&middot;</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No posts found in this category</h3>
          <p className="mt-2 text-gray-600">
            We don't have any posts in the {activeCategory} category yet. Check back soon!
          </p>
          <button
            onClick={() => setActiveCategory("All")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            View All Posts
          </button>
        </div>
      )}

      <div className="mt-12 bg-green-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900">Want more safari tips?</h3>
        <p className="mt-4 text-gray-600">
          Subscribe to our newsletter for monthly updates on wildlife sightings, conservation news, and exclusive offers.
        </p>
        <form className="mt-6 sm:flex max-w-md mx-auto">
          <label htmlFor="email-address" className="sr-only">Email address</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-5 py-3 border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-green-500 focus:border-green-500 sm:max-w-xs rounded-md"
            placeholder="Enter your email"
          />
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
            <button
              type="submit"
              className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}