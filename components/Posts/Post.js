import PropTypes from 'prop-types';
import React, { useRef, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';

const PostContainer = styled.div(() => ({
  width: '300px',
  margin: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
}));

const CarouselContainer = styled.div(() => ({
  position: 'relative', //Fixed the carousel size relative to image
}));

const Carousel = styled.div(() => ({
  display: 'flex',
  overflowX: 'hidden',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  position: 'relative', //Fixed the carousel size relative to image
}));

const CarouselItem = styled.div(() => ({
  flex: '0 0 auto',
  scrollSnapAlign: 'start',
}));

const Image = styled.img(() => ({
  width: '280px',
  height: 'auto',
  maxHeight: '300px',
  padding: '10px',
}));

const Content = styled.div(() => ({
  padding: '10px',
  '& > h2': {
    marginBottom: '16px',
  },
}));

const Button = styled.button(() => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  color: '#000',
  fontSize: '20px',
  cursor: 'pointer',
  height: '50px',
  width: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
}));
const UserDetails = styled.div(() => ({
  fontSize: '20px',
  color: '#555',
  marginTop: '10px',
  fontStyle: 'italic',
  fontWeight: 'bold',
}));

const PrevButton = styled(Button)`
  left: 10px;
`;

const NextButton = styled(Button)`
  right: 10px;
`;

const Post = ({ post }) => {
  const carouselRef = useRef(null);
  const [imageWidth, setImageWidth] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      const handleResize = () => {
        const firstImage = carouselRef.current.querySelector('img');
        if (firstImage) {
          setImageWidth(firstImage.clientWidth); // image width
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [carouselRef.current]);

  const handleNextClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: imageWidth,
        behavior: 'smooth',
      });
    }
  };

  const handlePrevClick = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -imageWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <PostContainer>
      <CarouselContainer>
        <Carousel ref={carouselRef}>
          {post.images.map((image, index) => (
            <CarouselItem key={index}>
              <Image
                src={image.url}
                alt={post.title}
                onLoad={() => {
                  const firstImage = carouselRef.current.querySelector('img');
                  if (firstImage) {
                    setImageWidth(firstImage.clientWidth); // image width
                  }
                }}
              />
            </CarouselItem>
          ))}
        </Carousel>
        <PrevButton onClick={handlePrevClick}>&#10094;</PrevButton>
        <NextButton onClick={handleNextClick}>&#10095;</NextButton>
      </CarouselContainer>
      {/* Rendered the user : email , name  */}
      <UserDetails>
        Name:<p>{post.userDetails.name}</p>
        Email:<p>{post.userDetails.email}</p>
      </UserDetails>
      <Content>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </Content>
    </PostContainer>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    content: PropTypes.any,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
      }),
    ),
    title: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
};

export default Post;
