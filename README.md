## Title
# Book_Search_Engine
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## Description
The Book Search Engine is a full-stack MERN application that allows users to search for books using the Google Books API and save their favorite books to their account. This project was originally built with a RESTful API, but has been refactored to use GraphQL with Apollo Server for better performance and scalability.

## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)


## Installation
To install and run the Book Search Engine locally, start by cloning the repository using git clone <YOUR_REPO_URL> and navigating into the project folder with cd book-search-engine. Since the application has both a client-side (React) and a server-side (Express, MongoDB, GraphQL), you’ll need to install dependencies separately. First, install the backend dependencies by navigating to the server directory with cd server and running npm install to install packages like Apollo Server, Express, and Mongoose. Then, install the frontend dependencies by navigating to the client directory with cd ../client and running npm install to set up React, Apollo Client, and Tailwind CSS. Once all dependencies are installed, start the application by running npm run develop from the root directory, which will launch both the server and client concurrently. Make sure you have MongoDB running locally or use MongoDB Atlas to store user data. The app should now be accessible at http://localhost:3000 in your browser.

## Website
You can also exsperience this fully deployed app here: [Book Search Engine](https://book-search-engine-djwt.onrender.com)


## Usage
Once the Book Search Engine is installed and running, users can search for books, save their favorites, and manage their reading list. Upon launching the application, users are presented with a search bar where they can enter book titles or keywords. The app fetches book details from the Google Books API and displays search results, including the book title, author, description, cover image, and a link to Google Books.

## License
License: https://opensource.org/licenses/MIT

## Contributing
Users can browse books without logging in, but to save books, they must create an account or log in via the Signup/Login modal. Once logged in, users gain access to a "Saved Books" page, where they can view, manage, or remove books from their collection. The authentication system is managed using JWT (JSON Web Tokens), ensuring secure user sessions.

## Tests
The application is fully responsive and easy to navigate, offering a clean UI with intuitive interactions. Users can log out at any time, and their saved books will remain available when they log back in. This project leverages GraphQL with Apollo Server, providing efficient data fetching and state management. Whether used as a personal reading tracker or a research tool, the Book Search Engine is a powerful and user-friendly way to explore and manage books online.

## Questions
For any questions, contact me at:
-GitHub: [IK8933](https://github.com/IK8933)
-Email: [iankessack1989@gmail.com](mailto:iankessack1989@gmail.com).

