import React from 'react';
import { useEffect, useState, useContext } from "react";
import {
  RecommendationList as HeadlessRecommendationList,
  loadClickAnalyticsActions,
  Result,
  buildRecommendationEngine,
  buildRecommendationList,
  getOrganizationEndpoints,
  RecommendationEngine,
} from "@coveo/headless/recommendation";
import { CustomContextContext } from "../CustomContext/CustomContextContext";
import { getSearchToken } from "../../common/Engine";
import { NoResultRecommendationConfig } from '../../config/SearchConfig';
import styled from 'styled-components';
import { Theme } from '../../config/theme';
import RecommendtionCard, { SkeletonRecommendtionCard } from '../Recommendations/RecommendationCard';
import { SearchConfigTranslations } from '../../config/InternationalizationConfig';
import { LanguageContext } from "../Internationalization/LanguageUtils";

interface NoResultProps {
    controller: HeadlessRecommendationList;
    engine: RecommendationEngine;
}

const NoResultRenderer: React.FC<NoResultProps> = (props) => {
    const engine = props.engine;
    const { controller } = props;
    const { getText } = useContext(LanguageContext)
    const [state, setState] = useState(controller.state);
  
    useEffect(() => {
      controller.refresh();
      controller.subscribe(() => setState(controller.state));
    }, []);
  
    if (state.error) {
      return (
        <div>
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

    const skeletonArray = [1, 2, 3];
    const NumberOfResult = NoResultRecommendationConfig.NumberofResults;
    return  <MainWrapper>

    <h2>{getText(NoResultRecommendationConfig.heading, SearchConfigTranslations, "noResults")}</h2>
    <Title>{getText(NoResultRecommendationConfig.heading, SearchConfigTranslations, "popularResults")}</Title>
    
    {state.recommendations.length > 0 ? (
      <CardWrapper>
        {state?.recommendations
          ?.slice(0, NumberOfResult)
          .map((recommendation, index) => {
            const temp: unknown =
              recommendation.raw[`${NoResultRecommendationConfig.imageField}`];
            const imageURL: string = temp as string;
            //@ts-ignore
            const description: unknown = recommendation[`${NoResultRecommendationConfig.excerptField}`]? recommendation[`${NoResultRecommendationConfig.excerptField}`] : recommendation.raw[`${NoResultRecommendationConfig.excerptField}`];
            return (
              <div key={recommendation.title + recommendation.uniqueId}>
                <RecommendtionCard
                  video={false}
                  title={recommendation.title}
                  description={description? description as string : ""}
                  image={imageURL ? imageURL : ""}
                  clickUri={recommendation.clickUri}
                  onClick={() => logClick(recommendation)}
                  onContextMenu={() => logClick(recommendation)}
                  onMouseDown={() => logClick(recommendation)}
                  onMouseUp={() => logClick(recommendation)}
                />
              </div>
            );
          })}
      </CardWrapper>
    ) : (
      <CardWrapper>
        {skeletonArray.map((item, index) => {
          return (
            <div key={item}>
              <SkeletonRecommendtionCard />
            </div>
          );
        })}
      </CardWrapper>
    )}

  </MainWrapper>
};




const NoResult: React.FC = () => {
    
  const [token, setToken] = useState('');
  const { settingContextFromEngine } = useContext(CustomContextContext);
  useEffect(()=>{
    (async ()=>{
      setToken(await getSearchToken())
    })()
  },[])



  if(!token) return null;


  const recommendationEngine = buildRecommendationEngine({
    configuration: {
      organizationId: process.env.REACT_APP_ORGANIZATION_ID!,
      accessToken: token,
      searchHub: NoResultRecommendationConfig.searchHub,
      pipeline: NoResultRecommendationConfig.pipeline,
      organizationEndpoints : getOrganizationEndpoints(process.env.REACT_APP_ORGANIZATION_ID!),
    },
  });



  settingContextFromEngine(recommendationEngine);

  const recController = buildRecommendationList(recommendationEngine, {
    options: { id: "no-result-recommendation",numberOfRecommendations : NoResultRecommendationConfig.NumberofResults },
  });


    return <NoResultRenderer controller = {recController} engine={recommendationEngine}/>;
};




export default NoResult;

const MainWrapper = styled.div`
/* position: relative;
display: flex;
flex-direction: column;
align-items: center; */
/*   width: 95%;
  max-width : 1800px; */
/*   background-color: white;
  border-radius: 24px; */
 /*  text-align : center; */
/*   position: relative;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center; */
/*   box-shadow: 0px 10px 25px rgba(229, 232, 232, 0.6); */
/*   margin-bottom: 30px; */
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 500;
  font-family: inherit;
  color: ${Theme.primaryText};
  margin-top: 30px;
  margin-bottom: 10px;
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
  flex-direction: row;
  flex-wrap: wrap;
/*   align-items: center;
  justify-content: center; */
  max-width: 1500px;
  margin-top: 20px;
`;
