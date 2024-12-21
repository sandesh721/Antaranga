import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploading from "react-images-uploading";
import nullImg from "../components/images/upload.jpeg";
import "../Pages/publishArticle.css";
import NavBar from "../components/navBar";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import supabase from "../supabase/supabase";
import Alert from "@mui/material/Alert";
import { TextField, Button, Typography, Stack } from "@mui/material";

function PublishArticle({ articleToEdit, mode }) {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [heading, setHeading] = useState("");
  const [article, setArticle] = useState("");
  const [alert, setAlert] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const maxNumber = 1;

  useEffect(() => {
    if (mode === "edit" && articleToEdit) {
      setHeading(articleToEdit.heading);
      setArticle(articleToEdit.article);
      setImageUrl(articleToEdit.img_url);
      setImages([{ data_url: articleToEdit.img_url }]);
    }
  }, [articleToEdit, mode]);

  const handleSubmit = async () => {
    if (!heading || !article || (mode !== "edit" && !selectedFile)) {
      setAlert({ severity: "error", message: "All fields are required!" });
      setTimeout(() => setAlert(null), 2000);
      return;
    }

    try {
      let img_url = imageUrl;

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from("articleImages")
          .upload(`public/${fileName}`, selectedFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        img_url = `https://uzbcnkeihbforjogyyfn.supabase.co/storage/v1/object/public/articleImages/${uploadData.path}`;
      }

      const { error } = mode === "edit"
        ? await supabase
            .from("articles")
            .update({ heading, article, img_url })
            .eq("id", articleToEdit.id)
        : await supabase
            .from("articles")
            .insert([{ heading, article, img_url }]);

      if (error) throw error;

      setAlert({ severity: "success", message: mode === "edit" ? "Article updated successfully!" : "Article published successfully!" });
      setTimeout(() => {
        setAlert(null);
        navigate("/articles");
      }, 2000);
    } catch (error) {
      console.error("Error:", error.message);
      setAlert({ severity: "error", message: `Error: ${error.message}` });
      setTimeout(() => setAlert(null), 2000);
    }
  };

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

  return (
    <div className="publish_Article">
      <div className="navbar">
        <NavBar />
      </div>
      <Typography variant="h4" gutterBottom className="heading">
        {mode === "edit" ? "Edit Article" : "Publish Article"}
      </Typography>
      <div className="publish_Article_container">
        <div className="upload">
          <ImageUploading
            multiple={false}
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
            acceptType={["jpg", "jpeg", "png"]}
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
        </Box>
        <Stack direction="row" spacing={2} className="publichButton">
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleSubmit}
          >
            {mode === "edit" ? "Update" : "Publish"}
          </Button>
        </Stack>

        {alert && (
          <Alert severity={alert.severity} className="floating-alert">
            {alert.message}
          </Alert>
        )}
      </div>
    </div>
  );
}

export default PublishArticle;
