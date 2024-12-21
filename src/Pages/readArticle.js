import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/navBar';
import supabase from '../supabase/supabase'; // Assuming you have supabase setup
import { Card, CardContent, TextField, Button, Avatar, Typography, Divider, CardMedia, Stack } from "@mui/material";
import "../Pages/readArticle.css";
import { pipeline } from "@huggingface/hub";
import * as tf from "@tensorflow/tfjs";

function ReadArticle() {
  const location = useLocation();
  const article = location.state; // Assuming article details are passed via state
  const created = article.created_at;
  const dateArray = new Date(created).toString().split(" ");
  const date = `${dateArray[1]} ${dateArray[2]}, ${dateArray[3]}`;

  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [editMode, setEditMode] = useState(null); // State to track which article is being edited
const [updatedData, setUpdatedData] = useState({ title: '', content: '' });

const handleEditChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
};
  
  const updateArticle = async (articleId, updatedData) => {
    const { error } = await supabase
        .from('articles')
        .update(updatedData)
        .eq('id', articleId);

    if (error) {
        alert('Error updating article: ' + error.message);
    } else {
        alert('Article updated successfully!');
        window.location.href = '/articles'; // Redirect to the articles page
    }
};
const deleteArticle = async (articleId) => {
  const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId);

  if (error) {
      alert('Error deleting article: ' + error.message);
  } else {
      alert('Article deleted successfully!');
      window.location.reload(); 
      window.location.href = '/article';
  }
};



  // Fetch comments for the article
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data: comments, error } = await supabase
          .from('commentArticle')
          .select('*')
          .eq('article_id', article.id)
          .order('created_at', { ascending: false });  // Fetch newest comments first
  
        if (error) {
          console.error('Error fetching comments:', error.message);
        } else {
          setAllComments(comments);
        }
      } catch (err) {
        console.error('Unexpected error:', err.message);
      }
    };
  
    if (article.id) {
      fetchComments();
    }
  }, [article.id]);
  

  // Handle adding a comment
  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        

       
        
        const { error } = await supabase
          .from('commentArticle')
          .insert([
            {
              article_id: article.id,
              username: 'User Name',  // Replace with actual user name or session user
              comment: newComment,
              created_at: new Date(),
            }
          ]);
  
        if (error) {
          console.error('Error adding comment:', error.message);
        } else {
          // Add new comment to the beginning of the comments list
          setAllComments([{ comment: newComment, user_name: 'User Name', created_at: new Date() }, ...allComments]);
          setNewComment("");
        }
      } catch (err) {
        console.error('Unexpected error:', err.message);
      }
    }
  };
  

  return (
    <>
        {editMode ? (
            <div className="edit-form">
                <h3>Edit Article</h3>
                <input
                    type="text"
                    name="title"
                    value={updatedData.title}
                    onChange={handleEditChange}
                    placeholder="Edit Title"
                />
                <textarea
                    name="content"
                    value={updatedData.content}
                    onChange={handleEditChange}
                    placeholder="Edit Content"
                />
                <button
                    onClick={() => {
                        updateArticle(editMode.id, updatedData);
                        setEditMode(null); // Exit edit mode
                    }}
                >
                    Update
                </button>
                <button onClick={() => setEditMode(null)}>Cancel</button>
            </div>
        ) : (
    <div className='container'>
      <NavBar />
      <div className='article-content'>
        <div className='heading'>
          <h1>{article.heading}</h1>
          <div className='buttons'>
          <Stack direction="row" spacing={2}>
      
            <Button className='editButton' onClick={() => setEditMode(article.id)} variant="contained" color="success">
              Edit
            </Button>
            <Button className='deleteButton' onClick={() => deleteArticle(article.id)} variant="contained" color="error">
              Delete
            </Button>
          </Stack>
          </div>
          <p>{date}</p>
        </div>

        <div className='img'>
          <Card className='image'>
            <CardMedia
              component="img"
              alt={article.heading}
              image={article.img_url}
            />
          </Card>
        </div>

        <div className='fullArticle'>
          <Typography variant="body2" style={{ fontSize: '18px', fontFamily: 'sans-serif', textAlign: 'justify' }}>
            {article.article}
          </Typography>
        </div>
      </div>

      {/* Comment Section */}
      <div className='comment_view'>
        <h3>Comments</h3>
        <div>
          {/* Input field for new comment */}
          <TextField
            label="Add a comment"
            multiline
            rows={3}
            fullWidth
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>

          <div style={{ marginTop: "20px" }}>
            {allComments.map((comment, index) => (
              <Card key={index} variant="outlined" style={{ marginBottom: "10px" }}>
                <CardContent>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                    <Avatar alt={comment.user_name} style={{ marginRight: "10px" }} />
                    <Typography variant="body1" fontWeight="bold">
                      {comment.user_name}
                    </Typography>
                  </div>
                  <Typography variant="body2">{comment.comment}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(comment.created_at).toLocaleString()}
                  </Typography>
                </CardContent>
                {index < allComments.length - 1 && <Divider />}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
    )}
    </>
  );
}

export default ReadArticle;