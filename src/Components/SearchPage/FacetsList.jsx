import { Facet as HeadlessFacet } from "@coveo/headless";
import {
  buildProductListing,
  buildProductListingFacetGenerator,
  buildSearch,
} from "@coveo/headless/commerce";
import { useEffect, useState, FunctionComponent } from "react";
import FacetGenerator from "../Facets/Generic/FacetGenerator";
import FacetSkeleton from "../Facets/Generic/FacetSkeleton";

export const FacetRenderer = (props) => {
  const { controller } = props;
  const [state, setState] = useState(controller.state);

  useEffect(() => controller.subscribe(() => setState(controller.state)), []);
  return <>
  {
    <FacetGenerator controller={controller} />
  }
  </>
};

const Facet = ({ engine, productListing }) => {
  let controller;
  if (productListing) {
    controller = buildProductListing(engine);
  } else {
    controller = buildSearch(engine);
  }
  const facetController = controller.facetGenerator();
  return <FacetRenderer controller={facetController} />;
};

export default Facet;
