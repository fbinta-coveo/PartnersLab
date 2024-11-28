import { buildProductListing, buildSearch } from "@coveo/headless/commerce";
import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { SearchConfigTranslations } from "../../config/InternationalizationConfig";
import { LanguageContext } from "../Internationalization/LanguageUtils";

const SummaryRenderer = ({ summaryController }) => {
  const [state, setState] = useState(summaryController.state);
  const { getText } = useContext(LanguageContext);

  useEffect(() => {
    const unsubscribe = summaryController.subscribe(() =>
      setState(summaryController.state)
    );
    return () => unsubscribe();
  }, [summaryController]);


  return (
    <>
      {!state.isLoading && state.hasProducts && (
        <SummaryContainer>
          {getText("Results of for", SearchConfigTranslations, "summaryResults").split(" ")[0]}{" "}
          <span>{state.firstProduct}</span>-<span>{state.lastProduct}</span>{" "}
          {getText("Results of for", SearchConfigTranslations, "summaryResults").split(" ")[1]}{" "}
          <span>{state.totalNumberOfProducts}
            </span>{" "}<>{state.query && <>
              {getText("Results of for", SearchConfigTranslations, "summaryResults").split(" ")[2]}{" "}
            <span>{state.query}</span></>}</>
        </SummaryContainer>
      )}
    </>
  );
};

const Summary = ({ engine, productListing = false }) => {
  let controller;
  if (productListing) {
    controller = buildProductListing(engine);
  } else {
    controller = buildSearch(engine);
  }

  const summaryController = controller.summary();

  return <SummaryRenderer summaryController={summaryController} />;
};


const SummaryContainer = styled.div`


    span {
        font-weight: 500;
    }

`

export default Summary;
