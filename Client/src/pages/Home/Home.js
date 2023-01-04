import React from "react";
import "./Home.css";

import NavBar from "../../components/NavBar";
import Categories from "../../components/Categories";
import PopularProduct from "../../components/PopularProduct";
import RecommendCategories from "./RecommendCategories";
import Recommend from "../../components/Recommend";
import Footer from "../../components/Footer";

import banner from "../../assets/images/5323800.jpg";

function Home({ UpdateNavbar }) {
    return (
        <div className="Home">
            <img src={banner} className="home-banner" alt="" />
            <Categories />
            <PopularProduct UpdateNavbar={UpdateNavbar} />
            <RecommendCategories />
            <Recommend />
        </div>
    );
}

export default Home;
