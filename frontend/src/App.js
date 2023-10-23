import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';


function App() {
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [result, setResult] = useState('');
  const [comments, setComments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/comments', { email, text });

      if (response.status === 200) {
        const data = response.data;
        setResult(`Comment added successfully.`);
        setEmail('');
        setText('');
        // After submitting a comment, fetch all comments to update the list
        fetchComments();
      } else {
        setResult('Error adding comment. Please try again.');
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/comments/${commentId}`);

      if (response.status === 200) {
        setResult(`Comment deleted successfully.`);
        // After deleting a comment, fetch all comments to update the list
        fetchComments();
      } else {
        setResult('Error deleting comment. Please try again.');
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const fetchComments = () => {
    axios.get('http://localhost:5000/api/comments')
      .then(response => {
        setComments(response.data);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });
  };

  useEffect(() => {
    // Fetch comments when the component mounts
    fetchComments();
  }, []);

  return (
    <div className="container">
      <div className="comment-form">
        <h1>Add a Comment</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="text">Comment:</label>
            <textarea
              className="form-control"
              id="text"
              rows="4"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">
            Submit
          </button>
        </form>
        <div id="result" className="result">
          {result}
        </div>
      </div>
      <div className="comment-list">
        <h2>All Comments</h2>
        <ul>
          {comments.map(comment => (
            <li key={comment.id} className="comment-item">
              <div>
                <strong>Email:</strong> {comment.email}
              </div>
              <div>
                <strong>Comment:</strong> {comment.text}
              </div>
              <span onClick={() => handleDelete(comment.id)} className="delete-icon">
                &#x2715;
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
