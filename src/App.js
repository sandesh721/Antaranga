import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Article from "./Pages/Article";
import Quote from "./Pages/Quote";
import PublishArticle from "./Pages/publisharticle";
import PublishQuote from "./Pages/publishQuote";
import ReadArticle from "./Pages/readArticle";
function App() {
  return(
    <Router>
        <div>
          <Routes>
            <Route path="/" element={<Home bg="white"/>} />
            <Route path="/article" element={<Article bg="yellow" />} />
            <Route path="/quote" element={<Quote bg="bisque" />} />
            <Route path="/publishArticle" element={<PublishArticle />} />
            <Route path="/article/:id" element={<ReadArticle />} />
            <Route path="/publishQuote" element={<PublishQuote />} />
            <Route path="aboutUs" />
            <Route path="contact" />
            <Route path="authors" />
            <Route path="portfolio" />
          </Routes>
        </div>
    </Router>
  )
}
export default App;