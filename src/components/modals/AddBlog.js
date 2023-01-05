import { useContext, useState } from 'react';
import './AddBlog.css';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import AppContext from '../../contexts/AppContext';

const AddBlog = (props) => {
  const appContextValue = useContext(AppContext);
  const [formData, setFormData] = useState({
    title: "",
    details: ""
  });

  const updateFields = (event) => {
    const { name, value } = event.target;

    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value,
      }
    });
  }

  const submit = () => {
    const blogRef = collection(db, "blogs")
    addDoc(blogRef, {
      dateAdded: new Date(),
      details: formData.details,
      title: formData.title,
      username: appContextValue.username,
    });

    setFormData(prevFormData => {
      return {
        ...prevFormData,
        title: '',
        details: ''
      }
    });

    props.hideModal();
  }

  return (
    <div className={props.show ? "addblog active" : "addblog"} onClick={props.hideModal}>
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
      </div>
    </div>
  );
}

export default AddBlog;