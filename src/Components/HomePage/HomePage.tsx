import React from "react";
import HeroHome from "./HeroHome";
import styled from "styled-components";
import { HomeRecommendationConfig } from "../../config/HomeConfig";
import HomeRecommendations from "../Recommendations/HomeRecommendations";

const HomePage: React.FC = () => {

  return (
    <>
      <HeroHome />
      <MainWrapper>
        {
          HomeRecommendationConfig.map((config) => {
              return <HomeRecommendations RecommendationConfig={config} />
            }
          )}
      </MainWrapper>
    </>
  );
};

const MainWrapper = styled.div`
  width: 100%;
    background-color: #F6F1EB;
  display: flex;
  flex-direction: column;
  align-items: center;
`;



export default HomePage;
