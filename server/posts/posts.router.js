const express = require('express');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');

const { default: axios } = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await fetchPosts();
    // TODO use this route to fetch photos for each post
    // axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);

    const postsWithImages = await Promise.all(
      posts.map(async post => {
        try {
          const { data: photos } = await axios.get(
            `https://jsonplaceholder.typicode.com/albums/${post.id}/photos`,
          );
          const images = photos.map(photo => ({ url: photo.url }));
          return {
            ...post,
            images,
          };
        } catch (error) {
          console.error(`Error fetching photos for post ${post.id}:`, error);
          return {
            ...post,
            images: [
              { url: 'https://picsum.photos/200/300' },
              { url: 'https://picsum.photos/200/300' },
              { url: 'https://picsum.photos/200/300' },
            ],
          };
        }
      }),
    );

    res.json(postsWithImages);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

module.exports = router;
