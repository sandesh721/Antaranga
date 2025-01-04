import React, { useEffect, useState } from "react";
import "./quote.css";
import NavBar from "../components/navBar";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase/supabase";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 
function Quote({ bg }) {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  useEffect(() => {
    const fetchQuotes = async () => {
      const { data, error } = await supabase.from("quotes").select("*");

      if (error) {
        console.log("Error fetching quotes:", error);
      } else {
        setQuotes(data);
      }
      setLoading(false);
    };

    fetchQuotes();
    fetchUserRole(); 
  }, []);
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
  const publishQuote = () => {
    navigate("/publishQuote");
  };
  const deleteQuote = async (id) => {
    console.log(id);
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id);
  
    if (error) {
      alert('Error deleting Quote: ' + error.message);
    } else {
      alert('Quote deleted successfully!');
      setQuotes((prevQuotes) => prevQuotes.filter((quote) => quote.id !== id));
    }
  };
  
  return (
    <>
      {loading ? (
        <div className="loading_spinner">
          <CircularProgress />
        </div>
      ) : (
        <div className="container_quote" style={{ backgroundColor: bg }}>
          <NavBar />
          <h1>Quotes</h1>
          <Stack direction="row" spacing={2}>
          {role === "admin" && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={publishQuote}
            >
              Publish
            </Button>
          )}
          </Stack>
          <div className="imageContainer">
          <div className="content">
            {quotes.map((quote) => (
              <div key={quote.id} className="singleImg">
                {role === "admin" && (
                <IconButton
                  aria-label="delete"
                  size="large"
                  className="deleteButton"
                  onClick={() => deleteQuote(quote.id)}
                >
                  <DeleteIcon />
                </IconButton>
                )}
                <img
                  src={quote.quote_url}
                  alt={quote.heading}
                  className="image"
                />
              </div>
            ))}
          </div>
        </div>

        </div>
      )}
    </>
  );
}

export default Quote;
