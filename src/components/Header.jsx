import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/signout`, {
        method: 'POST',
          credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    // If searchTerm is empty, remove it from params to show all posts
    if (searchTerm.trim() === '') {
      urlParams.delete('searchTerm');
    } else {
      urlParams.set('searchTerm', searchTerm);
    }
    const searchQuery = urlParams.toString();
    navigate(`/search${searchQuery ? `?${searchQuery}` : ''}`);
  };

  return (
    <Navbar className='border-b-2  top-0 z-50 w-full bg-white/100 dark:bg-gray-900/90 backdrop-blur '>
      <form onSubmit={handleSubmit} className='flex items-center'>
        {/* <div className='relative w-48 md:w-64 lg:w-96'>
          <input
            type='text'
            placeholder='Search the blogs...'
            className='w-full rounded-lg border border-gray-400 bg-white dark:bg-gray-900 py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all header-search-bar'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
    
          <button
            type='submit'
            className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white header-search-bar'
            aria-label='Search'
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', height: '24px', width: '24px' }}
          >
            <AiOutlineSearch size={22} />
          </button>
        </div> */}
        {/* Show search button for mobile and allow click to trigger search */}
        {/* <Button
          className='w-12 h-10 lg:hidden searchbutton ml-2 header-search-bar'
          color='gray'
          type='submit'
          aria-label='Search'
        >
          <AiOutlineSearch />
        </Button> */}
      </form>
        <Link
        to='/'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
      >
        {/* <span className='px-2 py-1 
        bg-gradient-to-r
         from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'
         >      */}
         {/* <span className='px-2 py-1 windsong-medium'>
          The Unfolded Passport
        </span> */}
          
    <img src="https://res.cloudinary.com/codercloud/image/upload/v1761455293/the-unfolded-high-resolution-logo-transparent_1_wjcyyp.png" className="footerlogo header-logo "/>

      </Link>
      <div className='flex gap-2 md:order-2'>
        <Button
          className='w-30 h-30 hidden sm:inline'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser?.user ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt='user' img={currentUser?.user.profilePicture} rounded bordered />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>@{currentUser?.user.username}</span>
              <span className='block text-sm font-medium truncate'>
                {currentUser?.user.email}
              </span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/sign-in'>
            <button className='blog-button h-12 text-sm' pill>
              Sign In
          </button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse >
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link className='nav-font-size' to='/'>Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/search'} as={'div'}>
          <Link className='nav-font-size' to='/search'>Blogs</Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link className='nav-font-size' to='/about'>About</Link>
        </Navbar.Link>
        {/* <Navbar.Link active={path === '/projects'} as={'div'}>
          <Link to='/projects'>About</Link>
        </Navbar.Link> */}
      </Navbar.Collapse>
    </Navbar>
  );
}