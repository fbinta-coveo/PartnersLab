import React, { useContext } from 'react';
import { Theme } from '../../config/theme';
import styled from "styled-components";
import { HeroConfig } from '../../config/HomeConfig';
import { useNavigate } from 'react-router-dom';
import { HeroConfigTranslations } from '../../config/InternationalizationConfig';
import { LanguageContext } from "../Internationalization/LanguageUtils";

const HeroHome: React.FC = () => {
    const navigate = useNavigate();
    const { getText } = useContext(LanguageContext);

    return (
        <Wrapper>
            <VideoWrapper>
                <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/Xl7MHL2Di48?autoplay=1&loop=1&mute=1&playlist=Xl7MHL2Di48"
                    allow="autoplay; loop; muted; fullscreen"
                    allowFullScreen
                    title="YouTube Video"
                ></iframe>
            </VideoWrapper>
            <TextWrapper>
                <Title>
                    {HeroConfig.title && getText(HeroConfig.title, HeroConfigTranslations, 'title')}
                </Title>
                <SubTitle>
                    {HeroConfig.description && getText(HeroConfig.description, HeroConfigTranslations, "description")}
                </SubTitle>
                <Button onClick={() => window.open(HeroConfig.onClickButtonRedirect)}>
                    {HeroConfig.buttonText && getText(HeroConfig.buttonText, HeroConfigTranslations, "buttonText")}
                </Button>
            </TextWrapper>
        </Wrapper>
    );
};

const Wrapper = styled.div`
  height: ${HeroConfig.height};
  width: ${HeroConfig.width};
  margin: 0 auto;
  font-family: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 120px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  /* background-color:red; */
  background-image: url(${HeroConfig.background});
  @media (max-width: ${Theme.mobileSize}px) {
      padding-left: 10px;
      width: 100vw;
      justify-content: flex-start;
      padding-top: 80px;
      height: ${Number(HeroConfig.height.split("px")[0]) - 150}px;
  }
`;

const VideoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  display: flex;
  justify-content: center;
  align-items: center;
  
  iframe {
    width: 110%; 
    height: 110%; 
    transform: scale(1.1); 
    transform-origin: center;
  }
`;

const TextWrapper = styled.div`
  width: 100%;
`;

const Title = styled.h1`
  width: 95%;
  font-weight: ${HeroConfig.titleFontWeight};
  max-width: ${HeroConfig.titleWidth};
  font-size: ${HeroConfig.titleFontSize};
  color: ${HeroConfig.titleColor};
  margin-top: 45px;
  @media (max-width: ${Theme.mobileSize}px) {
      font-size: ${Number(HeroConfig.titleFontWeight.substring(0, 2)) - 35}px;
  }
`;

const SubTitle = styled.p`
  font-weight: 300;
  max-width: ${HeroConfig.subTitleWidth};
  font-size: ${HeroConfig.subTitleFontSize};
  width: 90%;
  color: ${HeroConfig.subTitleColor};
  margin-top: 20px;
  @media (max-width: 480px) {
      width: 90%;
  }
`;

const Button = styled.button`
  padding: 2px 32px;
  height: 40px;
  background-color: transparent;
  border-radius: 0px;
  font-family: inherit;
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 24px;
  color: #000000;
  margin-top: 10px;
  border: none;
  text-underline-offset: px;
  cursor: pointer;
  text-decoration: underline;
  transition: 0.2s ease-in-out;
  
  &:hover {
    text-decoration: none; 
  }
`;


export default HeroHome;
