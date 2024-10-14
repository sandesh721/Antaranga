import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import nullImg from "../components/images/upload.jpeg";
import "../Pages/publishArticle.css";
import NavBar from "../components/navBar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import supabase from "../supabase/supabase";
import Alert from '@mui/material/Alert';

function PublishArticle() {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [heading, setHeading] = useState('');
  const [article, setArticle] = useState('');
  const [alert, setAlert] = useState(null);
  const maxNumber = 1;
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const onChange = (imageList) => {
    setImages(imageList);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([{ data_url: reader.result }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const publishArticleImg = async () => {
    if (!selectedFile || !heading || !article) {
      console.error("Please fill all the fields");
      return;
    }
  
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
  
    try {
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('articleImages')
        .upload(`public/${fileName}`, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });
  
      if (uploadError) {
        console.error("Error uploading image:", uploadError.message);
        return;
      }
  
      console.log("Upload data:", uploadData);
      console.log("Full Path to the file:", uploadData.path);
  
      // Corrected manual URL construction
      const manualPublicURL = `https://uzbcnkeihbforjogyyfn.supabase.co/storage/v1/object/public/articleImages/${uploadData.path}`;

      console.log("Manually generated public URL:", manualPublicURL);
  
      const { error: insertError } = await supabase
        .from('articles')
        .insert([{ heading, article, img_url: manualPublicURL }]);
  
      if (insertError) {
        console.error("Error inserting data into table:", insertError.message);
        setAlert({severity: 'error', message: 'Error inserting article!'});
      } else {
        setAlert({severity: 'success', message: 'Article published successfully!'});
        setTimeout(() => {
          setAlert(null);
          navigate('/article'); 
        }, 2000);
        console.log("Article published successfully!");
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      setAlert({severity: 'error', message: 'An unexpected error occurred!'});
      setTimeout(() => {
        setAlert(null);
      }, 2000);
    }
  };
  
  return (
    <div className="publish_Article">
      <div className="navbar">
        <NavBar />
      </div>
      <h3 className="heading">Publish your Article</h3>
      <div className="publish_Article_container">
        <div className="upload">
          <ImageUploading
            multiple={false}
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
            acceptType={["jpg"]}
          >
            {() => (
              <div className="upload__image-wrapper">
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <img
                  className="uploadImage"
                  src={images.length > 0 ? images[0].data_url : nullImg}
                  alt="Uploaded or Default"
                  width="500"
                  onClick={handleImageClick}
                  style={{ cursor: "pointer" }}
                />
                <br />
              </div>
            )}
          </ImageUploading>
        </div>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 3, width: "45ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="filled_basic"
            label="Enter the Article heading"
            variant="filled"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
          />
        </Box>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "70%" },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              id="outlined-multiline-flexible"
              label="Article"
              multiline
              maxRows={10}
              value={article}
              onChange={(e) => setArticle(e.target.value)}
              InputProps={{
                sx: {
                  height: "200px",
                  alignItems: "flex-start",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "300px",
                },
              }}
            />
          </div>
        </Box>
        <Stack direction="row" spacing={2} className="publichButton">
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={publishArticleImg}
          >
            Publish
          </Button>
          {alert && <Alert severity={alert.severity} color={alert.severity}>{alert.message}</Alert>}
        </Stack>
      </div>
    </div>
  );
}

export default PublishArticle;
