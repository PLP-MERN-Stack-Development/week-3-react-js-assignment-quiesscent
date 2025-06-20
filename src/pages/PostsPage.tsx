import React from 'react';
import { PostList } from '../components/posts/PostList';

export const PostsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PostList />
    </div>
  );
};