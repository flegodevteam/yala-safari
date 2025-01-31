import React from "react";

const BlogAndTips = () => {
  const articles = [
    {
      title: "Safari Preparation Guide",
      summary: "Learn the essentials for a safe and enjoyable safari experience."
    },
    {
      title: "Wildlife Facts You Should Know",
      summary: "Discover interesting facts about the diverse wildlife you'll encounter."
    },
    {
      title: "Conservation Efforts in Safari Parks",
      summary: "How eco-tourism helps preserve nature and protect endangered species."
    },
    {
      title: "Top Travel Tips for Safari Adventures",
      summary: "Best practices and tips to make the most of your safari trip."
    },
    {
      title: "Best Time to Visit Safaris",
      summary: "A seasonal guide to maximize your wildlife viewing experience."
    },
    {
      title: "Essential Gear for Safari Trips",
      summary: "A checklist of must-have items for your safari adventure."
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Blog and Tips</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold">{article.title}</h3>
            <p className="text-gray-700">{article.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogAndTips;
