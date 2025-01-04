import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/navBar';
import supabase from '../supabase/supabase';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Typography,
  Divider,
  CardMedia,
  Stack,
  Box,
  Grid,
} from "@mui/material";
import "../Pages/readArticle.css";
import { getAuth } from "firebase/auth"; 
import { getFirestore, doc, getDoc } from "firebase/firestore";
function ReadArticle() {
  const location = useLocation();
  const article = location.state; // Assuming article details are passed via state

  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [editMode, setEditMode] = useState(false); // Track edit mode
  const [role, setRole] = useState("");
  const [updatedData, setUpdatedData] = useState({
    heading: article.heading,
    content: article.article,
  });

  const fetchUserRole = async () => {
          try {
              const auth = getAuth();
              const user = auth.currentUser;
              if (user) {
                  const db = getFirestore();
                  const userRef = doc(db, "users", user.uid);
                  const userDoc = await getDoc(userRef);
  
                  if (userDoc.exists()) {
                      const userData = userDoc.data();
                      setRole(userData.role); 
                  }
              }
          } catch (error) {
              console.error("Error fetching user role:", error);
          }
      };
  const created = article.created_at;
  const dateArray = new Date(created).toString().split(" ");
  const date = `${dateArray[1]} ${dateArray[2]}, ${dateArray[3]}`;

  useEffect(() => {
    const fetchComments = async () => {
      const { data: comments, error } = await supabase
        .from('commentArticle')
        .select('*')
        .eq('article_id', article.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error.message);
      } else {
        setAllComments(comments);
      }
    };

    if (article.id) {
      fetchComments();
      fetchUserRole(); 
    }
  }, [article.id]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const { error } = await supabase
        .from('commentArticle')
        .insert([
          {
            article_id: article.id,
            username: 'User Name',
            comment: newComment,
            created_at: new Date(),
          },
        ]);

      if (error) {
        console.error('Error adding comment:', error.message);
      } else {
        setAllComments([{ comment: newComment, user_name: 'User Name', created_at: new Date() }, ...allComments]);
        setNewComment("");
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const updateArticle = async () => {
    const { error } = await supabase
      .from('articles')
      .update({
        heading: updatedData.heading,
        article: updatedData.content,
      })
      .eq('id', article.id);

    if (error) {
      alert('Error updating article: ' + error.message);
    } else {
      alert('Article updated successfully!');
      setEditMode(false);
    }
  };

  const deleteArticle = async () => {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', article.id);

    if (error) {
      alert('Error deleting article: ' + error.message);
    } else {
      alert('Article deleted successfully!');
      window.location.href = '/article';
    }
  };

  return (
    <>
      {/* <NavBar /> */}
      <Box className="container">
        {editMode ? (
          <Card className="edit-form">
            <CardContent>
              <Typography variant="h5">Edit Article</Typography>
              <TextField
                fullWidth
                margin="normal"
                label="Edit Title"
                name="heading"
                value={updatedData.heading}
                onChange={handleEditChange}
              />
              <TextField
                fullWidth
                margin="normal"
                multiline
                rows={5}
                label="Edit Content"
                name="content"
                value={updatedData.content}
                onChange={handleEditChange}
              />
              <Stack direction="row" spacing={2} marginTop={2}>
                <Button variant="contained" color="primary" onClick={updateArticle}>
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className='container'>
      <NavBar />
      <div className='article-content'>
        <div className='heading'>
          <h1>{article.heading}</h1>
          {role === "admin" && (
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
          )}
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
          </>
    )}
        
      </Box>
    </>
  );
}

export default ReadArticle;
