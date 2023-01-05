import { useState } from "react";
import "./Blog.css";
import DeleteBlog from "./modals/DeleteBlog";
import EditBlog from "./modals/EditBlog";

const Blog = (props) => {
  const { docId, title, details, username, dateAdded, buttons } = props;

  const [showModal, setShowModal] = useState({
    editBlog: false,
    deleteBlog: false,
  })

  const editBlogModal = () => {
    setShowModal(prevShowModal => {
      return {
        ...prevShowModal,
        editBlog: !prevShowModal.editBlog,
      }
    })
  }
  const deleteBlogModal = () => {
    setShowModal(prevShowModal => {
      return {
        ...prevShowModal,
        deleteBlog: !prevShowModal.deleteBlog,
      }
    });
  }

  return (
    <>
    <div className="blog">
      <div className="blog_head">
        <span className="title">{title}</span>
        {buttons && 
          <div className="buttons">
            <button onClick={editBlogModal}>
              <span>Edit</span>
            </button>
            <button onClick={deleteBlogModal}>
              <span>Delete</span>
            </button>
          </div>
        }
      </div>
      <span className="details">{details}</span>
      <div className="user_details">
        <span>~ {username} on</span>
        <span>{new Date(dateAdded.toDate().toString()).toDateString()} {new Date(dateAdded.toDate().toString()).toLocaleTimeString()}</span>
      </div>
    </div>
    <EditBlog show={showModal.editBlog} docId={docId} hideModal={editBlogModal} />
    <DeleteBlog show={showModal.deleteBlog} docId={docId} hideModal={deleteBlogModal} />
    </>
  );
}

export default Blog;