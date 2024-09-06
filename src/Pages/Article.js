import React from "react";
import { useEffect, useState } from "react";
import "./article.css"
import NavBar from "../components/navBar";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import cardImg from "../components/images/entry_image.png"
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import { useNavigate  } from "react-router-dom";
import supabase from "../supabase/supabase";

function Article({ bg }){

    const navigate = useNavigate();
    const [articles, setArticles] = useState([]); 

    useEffect(() => {
        const fetchArticles = async () => {
            const { data, error } = await supabase
                .from('articles') // Replace with your table name
                .select('*'); // Adjust columns as needed

                console.log(data);
            if (error) {
                console.error('Error fetching articles:', error);
            } else {
                setArticles(data);
            }
        };

        fetchArticles();
    }, []);

    const publishArticle = () => {
        navigate("/publishArticle"); 
    };
    return (
        <div className="container_article" style={{ backgroundColor: bg }}>
            <NavBar />

            <h2>My Articles</h2>
            <Stack direction="row" spacing={2}>
                <Button variant="outlined" startIcon={<AddIcon />} onClick={publishArticle}>
                    Publish
                </Button>
            </Stack>
            <div className="container_article_content">
                <div className="content">
                    {articles.map((article) => (
                        <Card sx={{ maxWidth: 345 }} key={article.id} className="eachCard">
                            <CardMedia
                                component="img"
                                alt={article.heading}
                                height="140"
                                image={article.img_url} // Make sure imageUrl is the correct field in your Supabase table
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {article.heading}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {article.article}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Share</Button>
                                <Button size="small">Read More</Button>
                            </CardActions>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default Article;