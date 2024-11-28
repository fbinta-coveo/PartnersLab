import React, { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import SearchBox from "../SearchPage/SearchBox";
import { Theme } from "../../config/theme";
import {
  SearchBarTitle,
} from "../../config/SearchConfig";
import Results from "./ResultsList";
import FacetList from "../SearchPage/FacetsList";
import { initializeCommerceHeadlessEngine } from "../../common/Engine";
import {
  FacetContainer,
  ResultsListContainer,
  SearchBoxContainer,
  SearchBoxTitleHeading,
  SearchInterfaceContainer,
  SearchWrapper,
} from "../SearchPage/SearchPage";
import BreadcrumbManager from "../SearchPage/BreadcrumbManager";
import Summary from "../SearchPage/Summary";
import SortComponent from "../SearchPage/SortComponent";
import PaginationManager from "../SearchPage/PaginationManager";

const PLP = () => {
  const [engine, setEngine] = useState(null);

  useEffect(() => {
    initializeCommerceHeadlessEngine().then((engine) => {
      setEngine(engine);
    });
  }, []);

  if (!engine) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Grid
        container
        justifyContent="center"
        style={{
          background: Theme.searchBarBackground,
          marginTop: "70px",
        }}
      >
        <SearchBoxContainer>
          {SearchBarTitle && (
            <SearchBoxTitleHeading>{SearchBarTitle}</SearchBoxTitleHeading>
          )}
          <SearchBox />
        </SearchBoxContainer>
      </Grid>
      <SearchInterfaceContainer>
        <SearchWrapper>
          <FacetContainer>
            <FacetList engine={engine} productListing={true} />
          </FacetContainer>
          <ResultsListContainer>
            <BreadcrumbManager engine={engine} productListing={true}/>
            <Summary engine={engine} productListing={true}/>
            <SortComponent engine={engine} productListing={true}/>
            <Results engine={engine} />
            <PaginationManager engine={engine} productListing={true} />
          </ResultsListContainer>
        </SearchWrapper>
      </SearchInterfaceContainer>
    </>
  );
};

export default PLP;

