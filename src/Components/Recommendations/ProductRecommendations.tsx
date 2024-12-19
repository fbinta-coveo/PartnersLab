import { useEffect, useState, FunctionComponent, useContext } from "react";
import { Theme } from "../../config/theme";
import styled from "styled-components";
import RecommendtionCard, {
  SkeletonRecommendtionCard,
} from "./RecommendationCard";
import { CustomContextContext } from "../CustomContext/CustomContextContext";
import { DefaultRecommendationImage } from "../../config/HomeConfig";
import { CommerceEngineContext, ProductRecommendationEngineContext } from "../../common/engineContext";
import {  buildFrequentlyBoughtTogetherList, buildFrequentlyViewedTogetherList, FrequentlyViewedTogetherList as FrequentlyViewedTogetherListController,loadClickAnalyticsActions, ProductRecommendation, FrequentlyBoughtTogetherList as FrequentlyBoughtTogetherListController, buildCartRecommendationsList } from "@coveo/headless/product-recommendation";
import { FieldToIncludesInSearchResults } from "../../config/SearchConfig";
import { initializeProductRecommendationEngine } from "../../common/Engine";
import { buildRecommendations } from "@coveo/headless/commerce";

interface RecommendationListProps {
  controller: any
  engine: any;
  title : string;
  rerender? : boolean;
}

export const RecommendationListRenderer: FunctionComponent<
  RecommendationListProps
> = (props) => {
  const engine = props.engine;
  const { controller,title,rerender } = props;
  const [state, setState] = useState(controller.state);

  useEffect(() => {
    controller.refresh();
    controller.subscribe(() => setState(controller.state));
  }, [rerender]);

  if (state.error) {
    return (
      <div>
        <div>Oops {state.error.message}</div>
        <code>{JSON.stringify(state.error)}</code>
        <button onClick={() => controller.refresh()}>Try again</button>
      </div>
    );
  }

  const logClick = (recommendation: ProductRecommendation) => {
    if (!engine) {
      return;
    }
    const { logProductRecommendationOpen } = loadClickAnalyticsActions(engine);
    engine.dispatch(logProductRecommendationOpen(recommendation));
  };

  const skeletonArray = [1, 2, 3];
  const NumberOfResult = 4;


  if(state.recommendations.length === 0){
    return null;
  }

  return (
    <MainWrapper>
      <Title>{title}</Title>
      {state.recommendations.length > 0 ? (
        <CardWrapper>
          {state?.recommendations
            ?.slice(0, NumberOfResult)
            .map((recommendation: any, index) => {
              console.log(recommendation)
              return (
                <div key={recommendation.documentUri}>
                  <RecommendtionCard
                    video={false}
                    title={recommendation.ec_name}
                    description={recommendation.ec_description}
                    image={recommendation.ec_images ? recommendation.ec_images : DefaultRecommendationImage}
                    clickUri={'/pdp/' + recommendation.permanentid as string}
                    onClick={() => logClick(recommendation)}
                    onContextMenu={() => logClick(recommendation)}
                    onMouseDown={() => logClick(recommendation)}
                    onMouseUp={() => logClick(recommendation)}
                    price={recommendation.ec_price}
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
  );
};

export const CommerceRecommendationListRenderer: FunctionComponent<
  RecommendationListProps
> = (props) => {

  const { controller,rerender } = props;
  const [state, setState] = useState(controller.state);

  useEffect(() => {
    controller.refresh();
    controller.subscribe(() => setState(controller.state));
  }, [rerender]);

  if (state.error) {
    return (
      <div>
        <div>Oops {state.error.message}</div>
        <code>{JSON.stringify(state.error)}</code>
        <button onClick={() => controller.refresh()}>Try again</button>
      </div>
    );
  }


  const skeletonArray = [1, 2, 3];
  const NumberOfResult = 4;


  if(state.products.length === 0){
    return null;
  }

  return (
    <MainWrapper>
      <Title>{state.headline}</Title>
      {state.products.length > 0 ? (
        <CardWrapper>
          {state?.products
            ?.slice(0, NumberOfResult)
            .map((recommendation: any, index) => {
              const interactiveResult = controller.interactiveProduct({options :{
                product: recommendation,
              }})
              return (
                <div key={recommendation.permanentid}>
                  <RecommendtionCard
                    video={false}
                    title={recommendation.ec_name}
                    description=""
                    image={recommendation.ec_images ? recommendation.ec_images : DefaultRecommendationImage}
                    clickUri={'/pdp/' + recommendation.permanentid as string}
                    onClick={() => interactiveResult.select()}
                    onContextMenu={() => interactiveResult.select()}
                    onMouseDown={() => interactiveResult.select()}
                    onMouseUp={() => interactiveResult.select()}
                    price={recommendation.ec_price}
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
  );
};



export const  FrequentlyViewedTogetherList : FunctionComponent<{skus: string[], title? : string}> = ({skus, title}) => {

const engine = useContext(CommerceEngineContext);
const slotid = process.env.REACT_APP_COMMERCE_PR_FVT_SLOTID;

if(!slotid){
  console.log("No slot id for frequenctly viewed together slot")
  return null;
}

  const controller = buildRecommendations(engine, {
    options : {
      slotId : slotid,
      productId : skus[0],
    }
  })

  return (
    <CommerceRecommendationListRenderer
      controller={controller}
      engine={engine}
      title={title || "Frequently Viewed Together"}
    />
  );
};


export const  CartRecommendationsList : FunctionComponent<{skus: string[], title? : string, rerender : boolean, searchhub? : string}> = ({skus, title, rerender, searchhub}) => {

  const [engine, setEngine] = useState(null);
  const { settingContextFromEngine } = useContext(CustomContextContext);
  useEffect(()=>{
    (async()=>{
      setEngine(await initializeProductRecommendationEngine(searchhub));
   })()
  },[])



  if(!engine){
    return null;
  }

  settingContextFromEngine(engine);
  const recController = buildCartRecommendationsList(engine,{options : {
    skus : skus,
    maxNumberOfRecommendations : 5,
    additionalFields : FieldToIncludesInSearchResults
  }});


  return (
    <RecommendationListRenderer
      controller={recController}
      engine={engine}
      title={title || "Cart Recommendations"}
      rerender={rerender}
    />
  );
};

export const  FrequentlyBoughtTogetherList : FunctionComponent<{sku: string, title? : string}> = ({sku, title}) => {

  const engine = useContext(CommerceEngineContext);

  const slotid = process.env.REACT_APP_COMMERCE_PR_FBT_SLOTID;

  if(!slotid){
    console.log("No slot id for frequenctly Bought together slot")
    return null;
  }

  const controller = buildRecommendations(engine, {
    options : {
      slotId : slotid,
      productId : sku,
    }
  })

  return (
    <CommerceRecommendationListRenderer
      controller={controller}
      engine={engine}
      title={title || "Frequently Bought Together"}
    />
  );
};


const MainWrapper = styled.div`
  width: 95%;
 /*  max-width : 1800px; */
  background-color: #F6F1EB;
  border-radius: 24px;
  text-align : left;
  position: relative;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
/*   box-shadow: 0px 10px 25px rgba(229, 232, 232, 0.6); */
  margin-bottom: 30px;
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 400;
  font-family: "Orator";
  color: ${Theme.primaryText};
  margin-top: 30px;
  margin-bottom: 10px;
  text-align : left;
  align-items: left;
  width: 100%;
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
  align-items: center;
  justify-content: center;
  /* max-width: 1500px; */
  margin-top: 10px;
  background-color: #F6F1EB;

`;
