import { useEffect, useState } from 'react';
import './Home.css';
import Header from "../components/Header";
import Blog from '../components/Blog';
import AuthModal from '../components/modals/AuthModal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Home = () => {
  const [showAuth, setShowAuth] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [showWelcomeText, setShowWelcomeText] = useState(false)

  const fetchBlogs = async() => {
    const blogRef = collection(db, "blogs");
    const blogData = await getDocs(blogRef);
    if (blogData.size > 0) {
      blogData.forEach((doc) => {
        setBlogs(prevBlogs => [
          ...prevBlogs,
          {
            ...doc.data(),
            docId: doc.id,
          }
        ]);
      });
    } else {
      setShowWelcomeText(true);
    }
  }

  const blogsElements = blogs.map((blog) => {
    return <Blog key={blog.docId} {...blog} docId={blog.docId} />;
  });

  useEffect(() => {
    fetchBlogs();
  }, [])

  return (
    <>
    <div className="home">
      <Header />
      {blogs.length === 0 ?
        showWelcomeText ? 
          <div className="welcomeText">
            <span>Be the first to blog ... </span>
          </div>
          :
          <div className="loading">
            <div className="lds-dual-ring"></div>
          </div>
        :
        <div className="blogs">
          {blogsElements}
        </div>
      }
    </div>
    <AuthModal show={showAuth} hideModal={() => setShowAuth(false)} />
    </>
  );
}

export default Home;