import { useContext, useEffect, useState } from 'react';
import './MyBlogs.css';
import Header from '../components/Header';
import Blog from '../components/Blog';
import AddBlog from '../components/modals/AddBlog';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import AppContext from '../contexts/AppContext';

const MyBlogs = () => {
  const appContextValue = useContext(AppContext);
  const [myBlogs, setMyBlogs] = useState([]);
  const [showModal, setShowModal] = useState({
    addBlog: false,
  });
  const [showWelcomeText, setShowWelcomeText] = useState(false);
  const [welcomeText, setWelcomeText] = useState("Publish your very first blog ...")

  const addBlogModal = () => {
    setShowModal(prevShowModal => {
      return {
        ...prevShowModal,
        addBlog: !prevShowModal.addBlog,
      }
    })
  }

  const myBlogsElements = myBlogs.filter(blog => {
    if (appContextValue.username !== "") {
      return blog.username === appContextValue.username ? blog : null
    } else {
      return blog;
    }
  }).map((myBlog) => {
    return (
      <Blog key={myBlog.docId} {...myBlog} docId={myBlog.docId} buttons={true} />
    );
  });

  useEffect(() => {
    if (appContextValue.username === "") {
      setWelcomeText("Sign in to publish your very first blog")
    } 

    const myBlogRef = collection(db, "blogs");
    const unsubscribe = onSnapshot(myBlogRef, (querySnapshot) => {
      setMyBlogs(prevMyBlogs => []);
      if (querySnapshot.size > 0) {
        querySnapshot.forEach(doc => {
          setMyBlogs(prevMyBlogs => [
            ...prevMyBlogs,
            {
              ...doc.data(),
              docId: doc.id,
            }
          ]);
        });
      } else {
        setShowWelcomeText(true);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line
  }, []);

  return (
    <>
    <div className="myblogs">
      <Header />
      <button className="addBlog" onClick={addBlogModal}>
        <span>Add Blog</span>
      </button>
      <div className="my_blogs">
        {myBlogsElements.length === 0 ?
          showWelcomeText ? 
            <div className="welcomeText">
              <span>{welcomeText}</span>
            </div>
            :
            <div className="loading">
              <div className="lds-dual-ring"></div>
            </div>
          :
          myBlogsElements
        }
      </div>
    </div>
    <AddBlog show={showModal.addBlog} hideModal={addBlogModal} />
    </>
  );
}

export default MyBlogs;