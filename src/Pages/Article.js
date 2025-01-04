import React, { useEffect, useState } from "react";
import "./article.css";
import NavBar from "../components/navBar";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";
import supabase from "../supabase/supabase";
import CircularProgress from '@mui/material/CircularProgress'; 
import InsertChartIcon from '@mui/icons-material/InsertChart';
import Modal from '@mui/material/Modal'; 
import { Bar } from 'react-chartjs-2';
import Backdrop from '@mui/material/Backdrop';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getAuth } from "firebase/auth"; 
import { getFirestore, doc, getDoc } from "firebase/firestore";
// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Article({ bg }) {
    const navigate = useNavigate();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [modalOpen, setModalOpen] = useState(false);
    const [sentimentData, setSentimentData] = useState({ positive: 0, neutral: 0, negative: 0, toxic: 0 });
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState("");
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
    const fetchArticles = async () => {
        const { data, error } = await supabase
            .from('articles')
            .select('*');

        if (error) {
            console.error('Error fetching articles:', error);
        } else {
            setArticles(data);
        }
        setLoading(false); 
    };

    useEffect(() => {
        fetchArticles();
        fetchUserRole(); 
    }, []);

    const publishArticle = () => {
        navigate("/publishArticle");
    };

    const readMore = (article) => {
        navigate(`/article/${article.id}`, { state: article }); 
    }

    const analyze = async (article) => {
        try {
            const { data: comments, error } = await supabase
                .from('commentArticle')
                .select('*')
                .eq('article_id', article.id);
    
            if (error) {
                console.error('Error fetching comments:', error);
                return;
            }
    
            if (comments.length === 0) {
                console.log('No comments to analyze.');
                setSentimentData({ positive: 0, neutral: 0, negative: 0, toxic: 0 });
                setModalOpen(true);
                return;
            }
    
            console.log('Comments fetched:', comments); // Log comments fetched
    
            const response = await fetch('http://localhost:5000/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comments }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const result = await response.json();
            console.log('Sentiment analysis result:', result); // Log the result of the sentiment analysis
            setSentimentData(result); 
            setOpen(false);
            setModalOpen(true);
    
        } catch (error) {
            console.error('Error analyzing comments:', error);
        }
    };
    
    

    const handleClose = () => {
        setModalOpen(false);
    };

    const showBackDrop = () => {
        setOpen(true);
    }
    const closeBackDrop = () => {
        setOpen(false);
    }

    return (
        <>
            {/* Loading Spinner */}
            {loading ? (
                <div className="loading_spinner"> 
                    <CircularProgress />
                </div>
            ) : (
                <div className="container_article" style={{ backgroundColor: bg }}>
                    <NavBar />
                    <h2>My Articles</h2>
                    <Stack direction="row" spacing={2}>
                        {role === "admin" && ( // Only show button if role is admin
                            <Button variant="outlined" startIcon={<AddIcon />} onClick={publishArticle}>
                                Publish
                            </Button>
                        )}
                    </Stack>
                    <div className="container_article_content">
                        <div className="content">
                            {articles.map((article) => (
                                <Card sx={{ maxWidth: 345 }} key={article.id} className="eachCard">
                                    <CardMedia
                                        component="img"
                                        alt={article.heading}
                                        height="140"
                                        image={article.img_url}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {article.heading}
                                        </Typography>
                                        <div className="truncate-text">
                                            {article.article}
                                        </div>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" onClick={() => readMore(article)}>Read More</Button>
                                        <Button size="small" onClick={() => {analyze(article); showBackDrop();}}>Analyze Responses
                                            <InsertChartIcon />
                                        </Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </div>
                    </div>
                    
                    <Backdrop
                        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                        open={open}
                        onClick={closeBackDrop}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                
                    <Modal open={modalOpen} onClose={handleClose}>
    <div className="modal-chart">
        <h3>Sentiment Analysis</h3>
        {console.log('Rendering chart with data:', sentimentData)} // Log data being used for the chart
        <Bar
            data={{
                labels: ['Positive', 'Neutral', 'Negative'],
                datasets: [
                    {
                        label: 'Sentiment Count',
                        data: [
                            sentimentData.positive, 
                            sentimentData.neutral, 
                            sentimentData.negative, 
                            // sentimentData.toxic
                        ],
                        backgroundColor: ['#4caf50', '#ffeb3b', '#f44336', '#9c27b0'],
                    },
                ],
            }}
            width={300}
            height={200}
            options={{
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                    },
                    title: {
                        display: true,
                        text: 'Sentiment Analysis Results',
                    },
                },
            }}
        />
        <Button variant="contained" onClick={handleClose}>Close</Button>
    </div>
</Modal>

                </div>
            )}
        </>
    );
}

export default Article;