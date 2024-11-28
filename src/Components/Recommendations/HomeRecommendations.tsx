import { useContext, useEffect, useState } from 'react'
import { CustomContextContext } from '../CustomContext/CustomContextContext';
import { getSearchToken } from '../../common/Engine';
import { buildRecommendationEngine, buildRecommendationList, getOrganizationEndpoints } from '@coveo/headless/recommendation';
import { RecommendationType } from '../../config/Types/ConfigTypes';
import RecommendationList from './RecommendationList';
import RecommendationSlider from './RecommendationSlider';
import RecommendationCarousel from './RecommendationCarousel';

interface HomeRecommendationsProps {
    RecommendationConfig: RecommendationType;
}

const HomeRecommendations = (props: HomeRecommendationsProps) => {
    const { RecommendationConfig } = props;

    const [token, setToken] = useState('');
    const { settingContextFromEngine } = useContext(CustomContextContext);
    useEffect(() => {
        (async () => {
            setToken(await getSearchToken())
        })()
    }, [])

    if(!token) return null;

    const recommendationEngine = buildRecommendationEngine({
        configuration: {
            organizationId: process.env.REACT_APP_ORGANIZATION_ID!,
            accessToken: token,
            searchHub: RecommendationConfig.searchHub,
            pipeline: RecommendationConfig.pipeline,
            organizationEndpoints : getOrganizationEndpoints(process.env.REACT_APP_ORGANIZATION_ID!),
        },
    })

    settingContextFromEngine(recommendationEngine);

    const recController = buildRecommendationList(recommendationEngine, {
        options: { id: RecommendationConfig.id },
    })

    switch(RecommendationConfig.type){
        case "list":
            return <RecommendationList config={RecommendationConfig} controller={recController} engine={recommendationEngine} />;
        case "carousel":
            return <RecommendationCarousel config={RecommendationConfig} controller={recController} engine={recommendationEngine} />;
        case "slider":
            return (<RecommendationSlider config={RecommendationConfig} controller={recController} engine={recommendationEngine} />);
        default:
            return (<></>);
    }
}

export default HomeRecommendations