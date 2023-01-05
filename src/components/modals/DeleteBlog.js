import { useEffect, useRef, useState } from 'react';
import './DeleteBlog.css';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const DeleteBlog = (props) => {
  const dataFetchedRef = useRef(false);
  const [formData, setFormData] = useState({
    title: "",
    details: "",
  });

  const getSingleDoc = async() => {
    const blogRef = doc(db, "blogs", props.docId);
    const blog = await getDoc(blogRef);
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        title: blog.data().title,
        details: blog.data().details,
      }
    });
  }

  const deleteDocument = async(event) => {
    event.preventDefault();

    const blogRef = doc(db, "blogs", props.docId);
    await deleteDoc(blogRef);
    props.hideModal();
  }

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    getSingleDoc();
    // eslint-disable-next-line
  }, []);
  
  return (
    <div className={props.show ? "deleteblog active" : "deleteblog"} onClick={props.hideModal}>
      <div className="form" onClick={e => e.stopPropagation()}>
        <span className="title">Are you sure you want to delete?</span>
        <div>
          <span>Title</span>
          <input
            name="title"
            value={formData.title}
            type="text"
            readOnly={true}
          />
        </div>
        <div>
          <span>Details</span>
          <textarea
            name="details"
            value={formData.details}
            type="text" 
            readOnly={true}         
          />
        </div>
        <button className="submit" onClick={deleteDocument}>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

export default DeleteBlog;