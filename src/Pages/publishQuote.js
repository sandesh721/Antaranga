import React, { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import nullImg from "../components/images/upload.jpeg";
import "../Pages/publishQuote.css";
import NavBar from "../components/navBar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import supabase from "../supabase/supabase";
import Alert from '@mui/material/Alert';  // Import MUI Alert component

function PublishQuote() {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [heading, setHeading] = useState('');
  const [alert, setAlert] = useState(null);  // State for alert
  const maxNumber = 1;
  const fileInputRef = useRef(null);
  const navigate = useNavigate();  // For navigation after publishing

  const onChange = (imgeList) => {
    setImages(imgeList);
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

  const publishQuoteImg = async () => {
    if (!selectedFile || !heading) {
      console.error("Please fill all the fields");
      return;
    }

    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    try {
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('quoteImages')
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
      const manualPublicURL = `https://uzbcnkeihbforjogyyfn.supabase.co/storage/v1/object/public/quoteImages/${uploadData.path}`;

      console.log("Manually generated public URL:", manualPublicURL);

      const { error: insertError } = await supabase
        .from('quotes')
        .insert([{ heading, quote_url: manualPublicURL }]);

      if (insertError) {
        console.error("Error inserting data into table:", insertError.message);
        setAlert({ severity: 'error', message: 'Error inserting quote!' });
      } else {
        setAlert({ severity: 'success', message: 'Quote published successfully!' });
        setTimeout(() => {
          setAlert(null);
          navigate('/quote');  // Redirect to quote page
        }, 2000);  // 2 seconds delay for alert
        console.log("Quote published successfully!");
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      setAlert({ severity: 'error', message: 'An unexpected error occurred!' });
      setTimeout(() => {
        setAlert(null);
      }, 2000);
    }
  };

  return (
    <div className="publish_quote">
      <div className="navbar">
        <NavBar />
      </div>
      <h3 className="heading">Publish Your Quotes</h3>
      <div className="publish_quote_container">
        <div className="uplaod">
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
            label="Enter the Quote heading"
            variant="filled"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
          />
        </Box>

        <Stack direction="row" spacing={2} className="publichButton">
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={publishQuoteImg}
          >
            Publish
          </Button>
        </Stack>

        {/* Show alert message */}
        {alert && (
          <Alert severity={alert.severity} color={alert.severity} style={{ position: 'fixed', top: 10, right: 10 }}>
            {alert.message}
          </Alert>
        )}
      </div>
    </div>
  );
}

export default PublishQuote;
