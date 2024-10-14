import React, {useEffect, useState} from "react";
import "./home.css";
import { Link } from 'react-router-dom';
import NavBar from "../components/navBar";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import linkedIn from "../components/icons/linkedin.png"
import instagram from "../components/icons/instagram.png"
import github from "../components/icons/github.png"
import twitter from "../components/icons/twitter.png";
import whatsapp from "../components/icons/whatsapp.png"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
function Home({ bg }){
const [open, setOpen] = useState(false);
    const handleSubscribe = () => {
        setOpen(true);;
    }
    const handleClose = () => {
        setOpen(false);
    }
  useEffect(()=>{
    const handleScroll = () =>{
        const newsletter = document.querySelector(".newsletter");
        const react = newsletter.getBoundingClientRect();
        console.log(`width:{react.width} height:{react.height} top:{react.top} bottom:{react.bottom}`);
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        if(react.top<= windowHeight && react.bottom >= 0){
            newsletter.classList.add("visible");
        }
        else{
            newsletter.classList.remove("visible");
        }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
}, []);
    return(
        <div className="container_home" style={{ backgroundColor: bg }}>
            <div className="container_about">
            <div className="navbar">
                <NavBar />
            </div>
            
            <span className="subtitle">Subtitle</span>
            <div className="about">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum consectetur nam est sapiente debitis voluptatibus eos suscipit sequi minima sit, obcaecati eaque cumque a quaerat, quas ex quisquam optio quo assumenda quia numquam ullam praesentium. Distinctio non vitae perferendis fuga, earum eos in! Excepturi molestias corporis, quibusdam aliquam ad quam.</p>
            </div>
            </div>
            <div className="newsletter">
                <h2>Newsletter.</h2>
                <p>Dive into the joy of awesomeness with our newsletter.<br />
                SUBSCRIBE NOW!</p>
                <div className="subscribe">
                    
                <React.Fragment>
                    <Button variant="outlined" onClick={handleSubscribe}>
                        Subscribe
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                        component: 'form',
                        onSubmit: (event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            const email = formJson.email;
                            console.log(email);
                            handleClose();
                        },
                        }}
                    >
                        <DialogTitle>Subscribe</DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            To subscribe to this website, please enter your email address here. We
                            will send updates occasionally.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="email"
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="standard"
                        />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Subscribe</Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
                </div>          
                <div className="follow">
                    <div className="social_media">
                        <h3>Follow Us On:</h3>
                        <img src={instagram} alt="instagram"></img>
                        <img src={linkedIn} alt="linkedin"></img>
                        <img src={github} alt="github"></img>
                        <img src={whatsapp} alt="whtsapp"></img>
                        <img src={twitter} alt="twitter"></img>
                    </div>
                    </div>
                    <div className="bottom_line">
                    <div className="more_links">
                        <Link className="resources" to="/about_us"><span>About Us /</span></Link>
                        <Link className="resources" to="/contact_us"><span>Contact Us /</span></Link>
                        <Link className="resources" to="/authors"><span>Authors /</span></Link>
                        <Link className="resources" to="/portfolio"><span>Portfolio</span></Link>

                    </div>
                    <div className="sources">
                        <Link className="resources" to="/about_us"><span>Source 1 /</span></Link>
                        <Link className="resources" to="/contact_us"><span>Source 2 /</span></Link>
                        <Link className="resources" to="/authors"><span>Source 3 /</span></Link>
                    </div> 
                </div>
                <p className="copyright">copyright@2024</p>    
            </div>
        </div>
    );
}
export default Home;