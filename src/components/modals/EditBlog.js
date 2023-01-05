import { useEffect, useRef, useState } from 'react';
import './EditBlog.css';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const EditBlog = (props) => {
  const dataFetchedRef = useRef(false);

  const [showSnackBar, setShowSnackBar] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
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

  const updateFields = (event) => {
    const { name, value } = event.target;

    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  const submit = (event) => {
    event.preventDefault()

    if (formData.title === "") {
      setWarningMessage("Please add a title to your blog!!");
      setShowSnackBar(true);
    } else if (formData.details === "") {
      setWarningMessage("Please add details to your blog!!");
      setShowSnackBar(false);
    } else {
      const blogRef = doc(db, "blogs", props.docId);
      setDoc(blogRef, {
        title: formData.title,
        details: formData.details,
      }, { merge:true });
      props.hideModal();
      getSingleDoc();
    }
  }

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    getSingleDoc();

    setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);    
    // eslint-disable-next-line
  }, [showSnackBar]);

  return (
    <div className={props.show ? "editblog active" : "editblog"} onClick={props.hideModal}>
      <div className="form" onClick={e => e.stopPropagation()}>
        <span className="title">Add Blog</span>
        <div>
          <span>Title</span>
          <input
            name="title"
            value={formData.title}
            onChange={updateFields}
            type="text"
          />
        </div>
        <div>
          <span>Details</span>
          <textarea
            name="details"
            value={formData.details}
            onChange={updateFields}
            type="text"          
          />
        </div>
        <button className="submit" onClick={submit}>
          <span>Submit</span>
        </button>
        {showSnackBar && <span className="warningMessage">{warningMessage}</span>}
      </div>
    </div>
  );
}

export default EditBlog;