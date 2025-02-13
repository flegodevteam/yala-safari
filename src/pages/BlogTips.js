import React from "react";

const articles = [
  {
    category: "Best Resorts",
    date: "17 Feb, 2023",
    title: "Safari Preparation Guide",
    description:
      "Gangtok is a beautiful city, known for its magical, natural surroundings.",
    image:
      "https://powertraveller.com/wp-content/uploads/2024/08/tissamaharama-yala-national-park-buffer-zone-night-drive.jpg",
    link: "#",
  },
  {
    category: "Travel",
    date: "17 Feb, 2023",
    title: "Wildlife Facts You Should Know",
    description:
      "Hello there sister friend, today we are talking about travel tips and tricks.",
    image:
      "https://cdn.prod.website-files.com/63a2007768b43db9e1be0382/645d448285bd184674916bd0_big-five-facts-you-do-not-know.jpeg",
    link: "#",
  },
  {
    category: "Best Resorts",
    date: "17 Feb, 2023",
    title: "Conservation Efforts In Safari Parks",
    description:
      "Gangtok is a beautiful city, known for its magical, natural surroundings.",
    image:
      "https://www.serengeti.com/assets/img/tanzania-serengeti-conservation-protection.jpg",
    link: "#",
  },
  {
    category: "Best Resorts",
    date: "17 Feb, 2023",
    title: "Top Travel Tips For safari Adventures",
    description:
      "Gangtok is a beautiful city, known for its magical, natural surroundings.",
    image:
      "https://turkanawildlifesafaris.com/wp-content/uploads/2024/07/wild-race-africa-safari-tours.jpg",
    link: "#",
  },
  {
    category: "Best Resorts",
    date: "17 Feb, 2023",
    title: "Best Time To Visit Safaries",
    description:
      "Gangtok is a beautiful city, known for its magical, natural surroundings.",
    image:
      "https://lp-cms-production.imgix.net/2021-10/GettyImages-104329693.jpg?fit=crop&w=3840&auto=format&q=75",
    link: "#",
  },
  {
    category: "Best Resorts",
    date: "17 Feb, 2023",
    title: "Essential Gear For Safari Tips",
    description:
      "Gangtok is a beautiful city, known for its magical, natural surroundings.",
    image:
      "https://d1azn61i9hwokk.cloudfront.net/image_banner/big/thesafaristore-safari-clothing-what-to-pack-for-your-safari-safari-luggage-advice-main.jpg",
    link: "#",
  },
];

const ArticleCard = ({ article }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-2xl transition-all">
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover transition-transform duration-300 transform hover:scale-105"
        />
      </div>
      <div className="text-sm text-orange-500 font-semibold flex items-center gap-2 mt-4">
        <span>📌 {article.category}</span>
        <span>📅 {article.date}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold text-gray-800">
        {article.title}
      </h3>
      <p className="text-gray-600 text-sm mt-2">{article.description}</p>
      <a
        href={article.link}
        className="text-blue-600 font-semibold hover:underline mt-4 inline-block"
      >
        Explore More →
      </a>
    </div>
  );
};

const BlogAndTips = () => {
  return (
    <div className="max-w-6xl mx-auto py-10 px-5">
      <h2 className="text-3xl font-bold text-gray-800">Trending Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {articles.map((article, index) => (
          <ArticleCard key={index} article={article} />
        ))}
      </div>
    </div>
  );
};

export default BlogAndTips;
