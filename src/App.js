import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Article from "./Pages/Article";
import Quote from "./Pages/Quote";
import PublishArticle from "./Pages/publisharticle";
import PublishQuote from "./Pages/publishQuote";
import ReadArticle from "./Pages/readArticle";
import LoginPage from './login';
import RegisterPage from './register';
import ForgotPasswordPage from './forgotpassword';
// import AdminDashboard from './pages/AdminDashboard';
// import UserDashboard from './pages/UserDashboard';
function App() {
  return(
    <Router>
        <div>
          <Routes>
            <Route path="/Home" element={<Home bg="white"/>} />
            <Route path="/article" element={<Article bg="yellow" />} />
            <Route path="/quote" element={<Quote bg="bisque" />} />
            <Route path="/publishArticle" element={<PublishArticle />} />
            <Route path="/article/:id" element={<ReadArticle />} />
            <Route path="/publishQuote" element={<PublishQuote />} />
            <Route path="aboutUs" />
            <Route path="contact" />
            <Route path="authors" />
            <Route path="portfolio" />
            
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
          </Routes>
        </div>
    </Router>
  )
}
export default App;