import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import Typewriter from 'typewriter-effect';
import './../mycss.css'
export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/post/getPosts`,
        {  credentials: 'include'});
      const data = await res.json();
      setPosts(data.posts);
    };
    console.log(posts);
    fetchPosts();
  }, []);
  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3  mx-auto bgimage '>
        <h1 className='text-3xl font-bold lg:text-6xl text-white'>
         <Typewriter
              options={{
                strings: ["Blogging Beyond Boundaries",
                "Collect sunsets, not souvenirs", 
                "Travel leaves you speechless, then turns you into a storyteller","Jobs fill your pocket, but adventures fill your soul","Live your life by a compass, not a clock"],
                autoStart: true,
                loop: true,
              }}
            />
            
        </h1>
        <p className='text-white text-xl sm:text-md'>
        Every page I unfold is a new piece of myself I discover. 
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm font-bold  w-fit'
        >
         <p className='blog-button'> View all blogs</p>
        </Link>
      </div>
      {/* <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div> */}

      <div className='max-w-7.5xl mx-auto p-16 flex flex-col gap-8 py-7'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-4xl font-semibold text-center windsong-medium'>Recent  Blogs</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='blog-button w-50 text-justify-center mx-auto mt-4'
            >
              View all blogs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}