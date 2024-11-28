import React, { useState, useEffect, useContext, FunctionComponent } from 'react';
import styled from 'styled-components';
import {
  RecommendationList as HeadlessRecommendationList,
  loadClickAnalyticsActions,
  Result,
  buildRecommendationEngine,
  buildRecommendationList,
  getOrganizationEndpoints,
} from '@coveo/headless/recommendation';
import { Theme } from '../../config/theme';
import RecommendtionCard, { SkeletonRecommendtionCard } from './RecommendationCard';
import { CustomContextContext } from '../CustomContext/CustomContextContext';
import { DefaultRecommendationImage, MainRecommendationConfig } from '../../config/HomeConfig';
import EngineContext from '../../common/engineContext';
import { getSearchToken } from '../../common/Engine';
import { useNavigate } from 'react-router-dom';
import { MainRecommendationConfigTranslations } from '../../config/InternationalizationConfig';
import { LanguageContext } from '../Internationalization/LanguageUtils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface RecommendationListProps {
  controller: HeadlessRecommendationList;
  engine: any;
}

export const RecommendationListRenderer: FunctionComponent<RecommendationListProps> = (props) => {
  const engine = props.engine;
  const { controller } = props;
  const { getText } = useContext(LanguageContext);
  const [state, setState] = useState(controller.state);
  const [currentIndex, setCurrentIndex] = useState(0); // for carousel

  useEffect(() => {
    controller.refresh();
    controller.subscribe(() => setState(controller.state));
  }, []);

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
  const type = MainRecommendationConfig.type;
  const numberOfResults = MainRecommendationConfig.numberOfResults;

  return (
    <MainWrapper>
      <Title>
        {MainRecommendationConfig.title && getText(MainRecommendationConfig.title, MainRecommendationConfigTranslations, 'title')}
      </Title>
      <SubTitle>
        {MainRecommendationConfig.description && getText(MainRecommendationConfig.description, MainRecommendationConfigTranslations, 'description')}
      </SubTitle>
      {type === 'carousel' ? (
        <>
          <SliderContainer>
            <ArrowButton onClick={prevSlide}>
              <ArrowBackIcon />
            </ArrowButton>
            <CardWrapper>
              {state.recommendations.length > 0 ? (
                getVisibleRecommendations().map((recommendation, index) => {
                  const imageURL: string = recommendation.raw[`${MainRecommendationConfig.imageField}`] as string;
                  const isFocused = index === 2; // the middle one is always focused
                  return (
                    <Slide key={recommendation.title + recommendation.uniqueId} isFocused={isFocused}>
                      <RecommendtionCard
                        video={false}
                        title={recommendation.title}
                        description={recommendation.excerpt}
                        image={imageURL ? imageURL : DefaultRecommendationImage}
                        clickUri={recommendation.clickUri}
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
            </CardWrapper>
            <ArrowButton onClick={nextSlide}>
              <ArrowForwardIcon />
            </ArrowButton>
          </SliderContainer>
          <DotsContainer>
            {state.recommendations.map((_, index) => (
              <Dot key={index} onClick={() => goToSlide(index)} isActive={index === currentIndex} />
            ))}
          </DotsContainer>
        </>
      ) : (
        <NormalCardWrapper>
          {state.recommendations.length > 0 ? (
            state.recommendations.slice(0, numberOfResults).map((recommendation) => {
              const temp: unknown = recommendation.raw[`MainRecommendationConfig.imageField`];
              const imageURL: string = temp as string;
              return (
                <div key={recommendation.title + recommendation.uniqueId}>
                  <RecommendtionCard
                    video={false}
                    title={recommendation.title}
                    description={recommendation.excerpt}
                    image={imageURL ? imageURL : DefaultRecommendationImage}
                    clickUri={recommendation.clickUri}
                    onClick={() => logClick(recommendation)}
                    onContextMenu={() => logClick(recommendation)}
                    onMouseDown={() => logClick(recommendation)}
                    onMouseUp={() => logClick(recommendation)}
                  />
                </div>
              );
            })
          ) : (
            skeletonArray.map((item) => (
              <div key={item}>
                <SkeletonRecommendtionCard />
              </div>
            ))
          )}
        </NormalCardWrapper>
      )}
    </MainWrapper>
  );
};

const MainRecommendationList = () => {
  const Engine = useContext(EngineContext)!;
  const [token, setToken] = useState('');
  const { settingContextFromEngine } = useContext(CustomContextContext);

  useEffect(() => {
    (async () => {
      setToken(await getSearchToken());
    })();
  }, []);

  if (!token) return null;

  const recommendationEngine = buildRecommendationEngine({
    configuration: {
      organizationId: process.env.REACT_APP_ORGANIZATION_ID!,
      accessToken: token,
      searchHub: MainRecommendationConfig.searchHub,
      pipeline: MainRecommendationConfig.pipeline,
      organizationEndpoints: getOrganizationEndpoints(process.env.REACT_APP_ORGANIZATION_ID!),
    },
  });

  settingContextFromEngine(recommendationEngine);

  const recController = buildRecommendationList(recommendationEngine, {
    options: { id: MainRecommendationConfig.id },
  });

  return <RecommendationListRenderer controller={recController} engine={recommendationEngine} />;
};

export default MainRecommendationList;

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
  font-weight: 400;
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

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
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
    background-color: ${Theme.primary};
  }
`;

const NormalCardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  max-width: 1500px;
  margin-top: 20px;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  width: 80%;
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
  transform: translateX(${({ isFocused }) => (isFocused ? '0' : '0')}) scale(${({ isFocused }) => (isFocused ? 1.2 : 1)});
  transition: transform 0.5s ease-in-out, flex 0.5s ease-in-out, opacity 0.5s ease-in-out;
  margin: ${({ isFocused }) => (isFocused ? '0 25px' : '0 0')};
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
