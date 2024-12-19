import {SearchEngine} from '@coveo/headless';
import {createContext} from 'react';
import { CommerceEngine } from "@coveo/headless/commerce";
import {ProductRecommendationEngine} from "@coveo/headless/product-recommendation"

const EngineContext = createContext<SearchEngine | null>(null);

export const EngineProvider = EngineContext.Provider;

export default EngineContext;


export const CommerceEngineContext = createContext<CommerceEngine | null>(null);
export const ProductRecommendationEngineContext = createContext<ProductRecommendationEngine | null>(null);
export const CommerceEngineProvider = CommerceEngineContext.Provider;

