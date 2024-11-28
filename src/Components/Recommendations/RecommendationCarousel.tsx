import { useEffect, useState, FunctionComponent, useContext } from "react";
import {
  RecommendationList as HeadlessRecommendationList,
  loadClickAnalyticsActions,
  Result,
} from "@coveo/headless/recommendation";
import { Theme } from "../../config/theme";
import styled from "styled-components";
import RecommendtionCard, {
  SkeletonRecommendtionCard,
} from "./RecommendationCard";
import { DefaultRecommendationImage } from "../../config/HomeConfig";
import { LanguageContext } from "../Internationalization/LanguageUtils";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { RecommendationType } from "../../config/Types/ConfigTypes";

interface RecommendationCarouselProps {
  controller: HeadlessRecommendationList;
  engine: any;
  config: RecommendationType;
}

const RecommendationCarousel =({config, controller, engine}: RecommendationCarouselProps) => {

  const { getText } = useContext(LanguageContext);
  const [state, setState] = useState(controller.state);
  const [currentIndex, setCurrentIndex] = useState(0); // for carousel


  useEffect(() => {
    controller.refresh();
    controller.subscribe(() => setState(controller.state));
  }, []);

  if(!config.active){
    return;
  }

  if (state.error) {
    return (
      <div>
        <div>Oops {state.error.message}</div>
        <code>{JSON.stringify(state.error)}</code>
        <button onClick={() => controller.refresh()}>Try again</button>
      </div>
    );
  }

  const logClick = (recommendation: Result) => {
    if (!engine) {
      return;
    }
    const { logRecommendationOpen } = loadClickAnalyticsActions(engine);
    engine.dispatch(logRecommendationOpen(recommendation));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex: number) => (prevIndex + 1) % state.recommendations.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex: number) =>
      prevIndex === 0 ? state.recommendations.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const getVisibleRecommendations = () => {
    const totalRecommendations = state.recommendations.length;
    const prevIndex = (currentIndex - 2 + totalRecommendations) % totalRecommendations;
    const nextIndex = (currentIndex + 2) % totalRecommendations;
    const prevPrevIndex = (currentIndex - 1 + totalRecommendations) % totalRecommendations;
    const nextNextIndex = (currentIndex + 1) % totalRecommendations;

    return [
      state.recommendations[prevIndex],
      state.recommendations[prevPrevIndex],
      state.recommendations[currentIndex],
      state.recommendations[nextNextIndex],
      state.recommendations[nextIndex],
    ];
  };

  const skeletonArray = [1, 2, 3, 4, 5];


  return (
    <MainWrapper>
      <Title>{config.title && getText(config.title, config, "title")}</Title>
      <SubTitle>{config.description && getText(config.description, config, "description")}</SubTitle>
     <SliderContainer>
            <ArrowButton onClick={prevSlide}>
              <ArrowBackIcon />
            </ArrowButton>
            <CarouselCardWrapper>
              {state.recommendations.length > 0 ? (
                getVisibleRecommendations().map((recommendation, index) => {
                  const temp: unknown = recommendation.raw[`${config.imageField}`];
                  const imageURL: string = temp as string;
                  const isFocused = index === 2; // the middle one is always focused
                  return (
                    <Slide key={recommendation.title + recommendation.uniqueId} isFocused={isFocused}>
                      <RecommendtionCard
                            video={false}
                            title={recommendation.raw.ec_name ? recommendation.raw.ec_name as string : ""}
                            description={recommendation.raw.ec_description ? recommendation.raw.ec_description as string : ""}
                            image={imageURL ? imageURL : DefaultRecommendationImage}
                            clickUri={recommendation.clickUri}
                            recommendation={recommendation}
                            onClick={() => logClick(recommendation)}
                            onContextMenu={() => logClick(recommendation)}
                            onMouseDown={() => logClick(recommendation)}
                            onMouseUp={() => logClick(recommendation)}
                      />
                    </Slide>
                  );
                })
              ) : (
                skeletonArray.map((item, index) => (
                  <Slide key={item} isFocused={index === 2}>
                    <SkeletonRecommendtionCard />
                  </Slide>
                ))
              )}
            </CarouselCardWrapper>
            <ArrowButton onClick={nextSlide}>
              <ArrowForwardIcon />
            </ArrowButton>
        </SliderContainer>
          <DotsContainer>
            {state.recommendations.map((_, index) => (
              <Dot key={index} onClick={() => goToSlide(index)} isActive={index === currentIndex} />
            ))}
          </DotsContainer>
    </MainWrapper>
  );
};


export default RecommendationCarousel;

const MainWrapper = styled.div`
  width: 95%;
  max-width : 1800px;
  background-color: white;
  border-radius: 24px;
  text-align : center;
  position: relative;
  top: -40px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 10px 25px rgba(229, 232, 232, 0.6);
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 500;
  font-family: inherit;
  color: ${Theme.primaryText};
`;

const SubTitle = styled.p`
  font-weight: 300;
  font-size: 18px;
  line-height: 28px;
  color: ${Theme.primaryText};
  margin-bottom: 20px;
`;


const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 1500px;
 
`;

const ArrowButton = styled.button`
  background-color: ${Theme.button};
  border: none;
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: ${Theme.button};
  }
`;

const CarouselCardWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  width: 90%;
  height: 700px;
  justify-content: center;
  align-items: center;
  position: relative;
  margin: 0px auto;
  
`;



type SlideProps = {
  isFocused: boolean;
};

const Slide = styled.div<SlideProps>`
  flex: 0 0 ${({ isFocused }) => (isFocused ? '3%' : '20%')};
  transition: all 0.5s ease-in-out;
  opacity: ${({ isFocused }) => (isFocused ? 1 : 0.6)};
  transform: translateX(${({ isFocused }) => (isFocused ? '0' : '0')}) scale(${({ isFocused }) => (isFocused ? 1.25 : 1)});
  transition: transform 0.5s ease-in-out, flex 0.5s ease-in-out, opacity 0.5s ease-in-out;
  margin: ${({ isFocused }) => (isFocused ? '0 47px' : '10px')};
  border-radius: 16px;

  img {
    width: 100%;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    height: 250px;
    object-fit: contain;
  }
`;

const DotsContainer = styled.div`
  display: flex;
`;

type DotProps = {
  isActive: boolean;
};

const Dot = styled.div<DotProps>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ isActive }) => (isActive ? Theme.primary : '#ccc')};
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: ${Theme.primary};
  }
`;

