const express = require('express');
const { fetchPosts } = require('./posts.service');
const { fetchAllUsers } = require('../users/users.service');
const { default: axios } = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
  // TODO use this route to fetch photos for each post
  // axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
  try {
    const posts = await fetchPosts();
    const users = await fetchAllUsers(); //feching user details

    const postsWithImagesPromises = posts.reduce((acc, post) => {
      //feteching following api end point for photos
      const promise = axios
        .get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`)
        .then(response => {
          console.log('Fetching photos for post', post.id);
          const images = response.data.map(photo => ({ url: photo.url }));
          //userDetails
          const user = users.find(user => user.id === post.id);
          const userDetails = user
            ? { name: user.name, email: user.email }
            : { name: 'Unknown', email: 'Unknown' };

          return { ...post, images, userDetails };
        })
        .catch(error => {
          console.error(`Error fetching photos for post ${post.id}:`, error);
          const user = users.find(user => user.id === post.userId);
          const userDetails = user
            ? { name: user.name, email: user.email }
            : { name: 'Unknown', email: 'Unknown' };

          return {
            ...post,
            images: [
              { url: 'https://picsum.photos/200/300' },
              { url: 'https://picsum.photos/200/300' },
              { url: 'https://picsum.photos/200/300' },
            ],
            userDetails,
          };
        });

      return [...acc, promise];
    }, []);

    const postsWithImages = await Promise.all(postsWithImagesPromises);

    res.json(postsWithImages);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

module.exports = router;
