import React,{useEffect, useState} from 'react';
import { buildSearchEngine, getOrganizationEndpoints, loadAdvancedSearchQueryActions, loadPipelineActions, loadSearchActions, loadSearchAnalyticsActions, loadSearchHubActions } from '@coveo/headless';
import EngineContext from '../../common/engineContext';
import { useParams } from 'react-router-dom';
import { getSearchToken,analyticsClientMiddleware } from '../../common/Engine';
import CoveoUA from '../../helper/CoveoAnalytics';
import { FrequentlyBoughtTogetherList, FrequentlyViewedTogetherList } from '../Recommendations/ProductRecommendations';
import styled from 'styled-components';
import ProductDescription from './ProductDescription';
import { Box, CircularProgress } from '@mui/material';
import Breadcrumbs from './Breadcrumbs';
import { websiteContextValue } from '../../config/SearchConfig';

const PDPage = ({engine})=>{

    const {permanentid} = useParams();
    const aq = `@permanentid=${permanentid}`;
    const [result, setResult] = useState(null);

    const sendDetailEvent = (firstResult) => {
        let category = '';
        const ec_category = firstResult.raw.ec_category || firstResult.raw['categories'];
        if (ec_category?.length) {
          let category_last = ec_category[ec_category.length - 1];
          category = category_last.split('|').join('/');
        }
        console.log("event",category);
            CoveoUA.detailView({
                brand: "Hermes",
                category : category,
                id: firstResult.raw.permanentid,
                group: firstResult.raw.ec_item_group_id,
                name: firstResult.raw.ec_name,
                price: firstResult.raw.ec_price,
              }, websiteContextValue, websiteContextValue);

    }

    useEffect(()=>{

        (async ()=>{

          const Engine =  buildSearchEngine({
                configuration: {
                  organizationEndpoints : getOrganizationEndpoints(process.env.REACT_APP_ORGANIZATION_ID),
                  organizationId: process.env.REACT_APP_ORGANIZATION_ID,
                  accessToken: await getSearchToken(),
                  renewAccessToken: getSearchToken,
                  analytics : {
                    analyticsClientMiddleware
                  },
                  search :{
                    searchHub : process.env.REACT_APP_SEARCH_HUB,
                    pipeline: process.env.REACT_APP_SEARCH_ENGINE_PIPELINE
                  }
                },
              });

        const advancedSearchQueryActions = loadAdvancedSearchQueryActions(Engine);
        const searchHubActions = loadSearchHubActions(Engine);
        const pipelineActions = loadPipelineActions(Engine);
        const analyticsActions = loadSearchAnalyticsActions(Engine);
        const searchActions = loadSearchActions(Engine);
        Engine.dispatch(pipelineActions.setPipeline(process.env.REACT_APP_SEARCH_ENGINE_PIPELINE));
        Engine.dispatch(searchHubActions.setSearchHub(process.env.REACT_APP_SEARCH_HUB));
        Engine.dispatch(advancedSearchQueryActions.updateAdvancedSearchQueries({ aq }));
        const res = await Engine.dispatch(
          searchActions.executeSearch(analyticsActions.logInterfaceLoad())
        );
        let firstResult = res?.payload?.response?.results[0] || null; 
        // Further Refine the first results
        if(res?.payload?.response?.results.length > 0){
          res?.payload?.response?.results.forEach((item)=>{
              if(item.raw.ec_name && item.raw.image){
                const regex = /^(?:https?:\/\/)?(?:www\.)?([^/]+)/i;
                const match = item.raw.image.match(regex);
                if(match){
                  firstResult = item;
                }
              }
          })
        }
        setResult(firstResult);
        if(firstResult){
            sendDetailEvent(firstResult);
            CoveoUA.logPageView();
        }

        })()
      
    },[])


    if(!result){
        return <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    }

    return <Container>
    {/* <Breadcrumbs categories={result.raw.category} /> */}
      <ProductDescription result={result}/>
    <FrequentlyViewedTogetherList skus={[`${result.raw.ec_product_id}`]}/>
    <FrequentlyBoughtTogetherList sku={result.raw.ec_product_id}/>
    </Container>
};


const Container = styled.div`
  padding : 120px 20px;
  height:1500px;
  background-color:#F6F1EB;
`



export default PDPage;