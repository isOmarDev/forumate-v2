import { useEffect, useState } from 'react';
import { Layout } from '../components/layout';
import { PostsList } from '../components/postsList';
import { PostsViewSwitcher } from '../components/postsViewSwitcher';
import { api } from '../api';
import { Post } from '@forumate/api/posts';

export const MainPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      try {
        const response = await api.posts.getPosts();

        if (isMounted) {
          setPosts(response.data!.posts);
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout>
      <PostsViewSwitcher />
      <PostsList posts={posts} />
    </Layout>
  );
};
