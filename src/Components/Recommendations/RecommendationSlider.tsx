import {
    RecommendationList as HeadlessRecommendationList,
    loadClickAnalyticsActions,
    Result,
  } from "@coveo/headless/recommendation";
import { RecommendationType } from "../../config/Types/ConfigTypes";
import { useContext, useEffect, useRef, useState } from "react";
import { LanguageContext } from "../Internationalization/LanguageUtils";
import styled from "styled-components";
import { Theme } from "../../config/theme";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { DefaultRecommendationImage } from "../../config/HomeConfig";
import RecommendtionCard, { SkeletonRecommendtionCard } from "./RecommendationCard";

interface RecommendationSliderProps {
    config: RecommendationType;
    controller: HeadlessRecommendationList;
    engine: any;
}

const RecommendationSlider = ({ config, controller, engine }: RecommendationSliderProps) => {

    const { getText } = useContext(LanguageContext)
    const [state, setState] = useState(controller.state)
    const scrollContainerRef = useRef(null);
    const NumberOfResults = config.numberOfResults;
    const skeletonArray = [1, 2, 3, 4, 5];

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

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            const scrollContainerWidth = scrollContainerRef.current.offsetWidth;
            scrollContainerRef.current.scrollBy({
                left: -scrollContainerWidth / 2,
                behavior: 'smooth',
            });
        }
      };
    
      const scrollRight = () => {
        if (scrollContainerRef.current) {
        const scrollContainerWidth = scrollContainerRef.current.offsetWidth;
          scrollContainerRef.current.scrollBy({
            left: scrollContainerWidth / 2,
            behavior: 'smooth',
          });
        }
      };

    return (
        <MainWrapper>
            <Title>{config.title && getText(config.title, config, "title")}</Title>
            <SubTitle>{config.description && getText(config.description, config, "description")}</SubTitle>
            <Slider>
                <ArrowButton onClick={scrollLeft}><ArrowBackIcon /></ArrowButton>
                <CardWrapper ref={scrollContainerRef}>
                {state.recommendations.length > 0 ? (
                    state.recommendations.slice(0, NumberOfResults).map((recommendation) => {
                    const temp: unknown = recommendation.raw[`${config.imageField}`];
                    const imageURL: string = temp as string;
                    return (
                        <div key={recommendation.title + recommendation.uniqueId}>
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
                        </div>
                    );
                    })
                ) : (
                    skeletonArray.map((_, index) => (
                      <SkeletonRecommendtionCard key={index} />
                    ))
                )}
                </CardWrapper>
                <ArrowButton onClick={scrollRight}><ArrowForwardIcon /></ArrowButton>
            </Slider>
        </MainWrapper>
    )
}

export default RecommendationSlider

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

const Slider = styled.div`
    width: 100%;
    max-width: 1500px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`
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

const CardWrapper = styled.div`
  display: flex;
  overflow-x: scroll;
  align-items: stretch;  // Ensure cards stretch to the same height
  width: 90%;
  gap: 20px;
  padding: 20px 0px;

  &::-webkit-scrollbar {
    display: none;
  }
`;