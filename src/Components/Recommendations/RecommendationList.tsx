import {
    RecommendationList as HeadlessRecommendationList,
    loadClickAnalyticsActions,
    Result,
  } from "@coveo/headless/recommendation";
import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../Internationalization/LanguageUtils";
import styled from "styled-components";
import { Theme } from "../../config/theme";
import { RecommendationType } from "../../config/Types/ConfigTypes";
import { DefaultRecommendationImage } from "../../config/HomeConfig";
import RecommendtionCard, { SkeletonRecommendtionCard } from "./RecommendationCard";

interface RecommendationListProps {
    config: RecommendationType;
    controller: HeadlessRecommendationList;
    engine: any;
}

const RecommendationList = (props: RecommendationListProps) => {

    const { config, controller, engine } = props;
    const { getText } = useContext(LanguageContext);
    const [state, setState] = useState(controller.state);
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

    const NumberOfResults = config.numberOfResults;

  return (
    <MainWrapper>
        <Title>{config.title && getText(config.title, config, "title")}</Title>
        <SubTitle>{config.description && getText(config.description, config, "description")}</SubTitle>
        <CardWrapper>
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
    </MainWrapper>
  )
}

export default RecommendationList

const MainWrapper = styled.div`
  width: 95%;
  max-width: 1800px;
  background-color: white;
  border-radius: 24px;
  text-align: center;
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
  margin-top: 30px;
`;

const SubTitle = styled.p`
  font-weight: 300;
  font-size: 18px;
  line-height: 28px;
  color: ${Theme.primaryText};
  margin-bottom: 20px;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;  // Ensure cards stretch to the same height
  justify-content: center;
  max-width: 1500px;
  margin-top: 20px;
  gap: 15px;
`;