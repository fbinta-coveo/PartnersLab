import { FunctionComponent, useEffect, useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import {
  SearchBox as HeadlessSearchBox,
  StandaloneSearchBoxOptions,
  buildSearchBox,
  loadSearchActions,
  loadSearchAnalyticsActions,
  loadQueryActions,
  buildResultList,
  ResultList,
} from "@coveo/headless";
import EngineContext from "../../common/engineContext";
import { useNavigate } from "react-router-dom";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import styled from "styled-components";
import { ClickAwayListener, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Theme } from "../../config/theme";
import Button from '@mui/material/Button';
import { Icon } from "react-icons-kit";
import { search } from "react-icons-kit/feather/search";
import { FieldToIncludesInSearchResults, ResultsImageField } from "../../config/SearchConfig";

import { SearchPageTabConfig} from "../../config/SearchConfig";
import { SpeechRecognitionButton } from "../SearchPage/SpeechRecognitionButton";
import {ImageRecognitionButton} from "../SearchPage/ImageRecognition";
import CloseIcon from '@mui/icons-material/Close';
import {LanguageContext} from "../Internationalization/LanguageUtils";
import {SearchConfigTranslations} from "../../config/InternationalizationConfig";
import { HeaderLogo } from "../../config/HomeConfig";

const firstTab = SearchPageTabConfig[0].caption;


const defaultSearchPageRedirect = ()=> window.open(`/search/${firstTab.replace(/\s/g, "")}#tab=${encodeURI(firstTab)}`,"_self")

const withQuerySearchPageRedirect = ()=>window.open(`/search/${firstTab.replace(/\s/g, "")}/${window.location.hash}&tab=${encodeURI(firstTab)}`,"_self")


interface HomeResultsSearchBoxProps {
  searchBoxController: HeadlessSearchBox;
  toggleSearchBox: () => void;
  ResultListController : ResultList
}

const HomeResultsSearchBoxRenderer: FunctionComponent<
  HomeResultsSearchBoxProps
> = (props) => {
  const { searchBoxController,ResultListController } = props;
  const engine = useContext(EngineContext)!;
  const [state, setState] = useState(searchBoxController.state);
  const [resultState, setResultState] = useState(ResultListController.state)
  const [searchTerm, setSearchTerm] = useState("");
  const [openPopper, setOpenPopper] = useState(false);
  const { getText } = useContext(LanguageContext);

  let navigate = useNavigate();

  useEffect(
    () =>
      searchBoxController.subscribe(() => setState(searchBoxController.state)),
    [searchBoxController]
  );

  useEffect(
    () =>
    ResultListController.subscribe(() => setResultState(ResultListController.state)),
    [ResultListController]
  );


  useEffect(() => {
    const unsub = setTimeout(async () => {
      const queryAction = loadQueryActions(engine);
      await engine.dispatch(
        queryAction.updateQuery({
          q: searchTerm,
          enableQuerySyntax: true,
        })
      );

      const analyticsAction = loadSearchAnalyticsActions(engine);
      const searchAction = loadSearchActions(engine);
      const searchSubmitAction = searchAction.executeSearch(
        analyticsAction.logSearchboxSubmit()
      );
      await engine.dispatch(searchSubmitAction);

      /* searchBoxController.submit() */
    }, 500);

    return () => clearTimeout(unsub);
  }, [searchTerm]);

  const onPressSearchButton = ()=>{
   /*  navigate('/search'); */
    props.toggleSearchBox();
    searchBoxController.submit();

    if(searchTerm === ""){
      defaultSearchPageRedirect()
      return;
    }

    withQuerySearchPageRedirect()
}

  return (
    <Container>
    <MainWrapper>
      <ClickAwayListener onClickAway={() => setOpenPopper(false)}>
        <>
          <TextField
            autoComplete="off"
            value={searchTerm}
            onChange={(event) => {
              const newInputValue = event.target.value;
              searchBoxController.updateText(newInputValue);
              setSearchTerm(newInputValue);
            }}
            onFocus={() => {
              setOpenPopper(true);
            }}
            onBlur={() => {
              setOpenPopper(false);
            }}
            InputProps={{
              endAdornment: (
                <EndButtons>
                  { 
                    state.value.length > 0 && (
                      <ClearButton onClick={() => searchBoxController.updateText("")}>
                        <CloseIcon/>
                      </ClearButton>
                    )
                  }
                  <SpeechRecognitionButton controller={searchBoxController} callback={withQuerySearchPageRedirect}></SpeechRecognitionButton>
                  <ImageRecognitionButton controller={searchBoxController} callback={withQuerySearchPageRedirect}></ImageRecognitionButton>
                </EndButtons>
              ),
            }}
            className="home-search-box"
            placeholder={getText("Search", SearchConfigTranslations, "searchPlaceholder")}
            size="small"
            onKeyDown={(e) => {
              if (
                e.code === "Enter" &&
                searchBoxController.state.value !== ""
              ) {
                props.toggleSearchBox();
                searchBoxController.submit();
                /* navigate("/search"); */
                withQuerySearchPageRedirect()
              }
            }}
          />
          <PopperStyledComponent
            hidden={!openPopper}
            style={{
              width: "120%",
            }}
          >
            <PopperMainWrapper>
              <PopperQSContainer>
                <PopperTitle>{getText("Suggested Searches", SearchConfigTranslations, "suggestedSearches")} </PopperTitle>
                { state.suggestions.length > 0 ? (
                    <>
                    {state.suggestions.map((suggestion) => {
                      const matches = match(suggestion.rawValue, searchTerm);
                      const parts = parse(suggestion.rawValue, matches);
                      return (
                        <PopperQSListItem key = {suggestion.rawValue} 
                          onMouseDown={(event) => {
                            event.stopPropagation();
                            searchBoxController.updateText(suggestion.rawValue);
                            setSearchTerm(suggestion.rawValue);
                            props.toggleSearchBox();
                            searchBoxController.submit();
                            withQuerySearchPageRedirect()
                            /* navigate("/search"); */
                          }}
                        >
                          <SearchIconStyled />
                          <div>
                              {parts.map((part, index) => (
                                <span
                                  key={index}
                                  style={{
                                    fontWeight: part.highlight ? 500 : 300,
                                  }}
                                >
                                  {part.text}
                                </span>
                              ))}
                          </div>
                        </PopperQSListItem>
                      );
                    })}
                    </>
                  ) : (
                    <p>No results found</p>
                  )}
              </PopperQSContainer>
              <PopperResultsContainer>
                <PopperTitle>{getText("Featured Results", SearchConfigTranslations, "featuredResults")}</PopperTitle>

                <ResultContainer>
                { resultState.results.length > 0 ? 
                      <>
                          {resultState.results.slice(0, 6).map((result) => {
                          let src: any = result.raw[ResultsImageField] || result.raw['ytthumbnailurl'];
                          return (
                            <PopperResultItem
                              key = {result.uniqueId}
                              onMouseDown={() => {
                                window.open(result.clickUri, "_blank");
                              }}
                            >
                              <PopperResultImage
                                  src={src ? src : HeaderLogo}
                                  style={src ? {} : {background: "#e9e9e9", objectFit: "contain", padding: "20px"}}
                                  alt={result.title}
                               />
                              <PopperResultTitle
                                href={result.clickUri}
                                onMouseDown={() => {
                                  window.open(result.clickUri, "_blank");
                                }}
                              >
                                {result.title}
                              </PopperResultTitle>
                              <PopperResultDescription>
                                {result.excerpt}
                              </PopperResultDescription>
                            </PopperResultItem>
                          );
                        })}
                      </>
                      :
                      <></>
                    }
                </ResultContainer>
                <CenteredDiv>
                  <PopperSeeMore onMouseDown={(event)=>{
                    event.stopPropagation();
                    props.toggleSearchBox();
                    searchBoxController.updateText(searchTerm)
                    searchBoxController.submit();
                    defaultSearchPageRedirect()
                    window.open('/search' + window.location.hash,"_self");
                  }}>{getText("More Results", SearchConfigTranslations, "moreResults")}
                  </PopperSeeMore>
                </CenteredDiv>
              </PopperResultsContainer>
            
            </PopperMainWrapper>
          </PopperStyledComponent>
        </>
      </ClickAwayListener>
    </MainWrapper>
    <SearchButton type='submit' variant="contained" style={{height : '43px', marginLeft: '10px'}} onClick={onPressSearchButton}><Icon icon={search} size={24} /></SearchButton>

    </Container>
  );
};

interface SearchBoxType {
  toggleSearchBox: () => void;
}

const HomeResultsSearchBox = ({ toggleSearchBox }: SearchBoxType) => {

  const options: StandaloneSearchBoxOptions = {
    numberOfSuggestions: 8,
    redirectionUrl: "/search",
  };
  const engine = useContext(EngineContext)!;
  const searchBoxController = buildSearchBox(engine, { options });
  const ResultListController = buildResultList(engine, {
    options: { fieldsToInclude: FieldToIncludesInSearchResults },
  });
  searchBoxController.updateText('');

  return (
    <HomeResultsSearchBoxRenderer
      searchBoxController={searchBoxController}
      toggleSearchBox={toggleSearchBox}
      ResultListController = {ResultListController}
    />
  );
};

export default HomeResultsSearchBox;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 45px;
  z-index: 8;
  position: relative;
  width: 100%;
`;

const PopperStyledComponent = styled.div`
  background: white;
  border-radius: 6px;
  box-shadow: 0px 7px 13px 2px rgba(0, 0, 0, 0.08);
  position: relative;
`;

const PopperMainWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 20px;
  gap: 50px;
`;

const PopperImage = styled.img``;

const PopperQSContainer = styled.div`
  flex: 1.5;
  margin: 0px 0px;
`;
const PopperResultsContainer = styled.div`
  flex: 3;
  padding-bottom: 20px;
  justify-content: flex-start;
`;

const ResultContainer = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px;
  padding: 0;
  margin-top: 10px;
`;

const PopperQSListItem = styled.li`
  list-style: none;
  padding: 5px 5px;
  cursor: pointer;
  transition: all 0.1s ease-in;
  border-radius: 6px;
  display: flex;
  align-items: center;
  width: 100%;
  &:hover {
    background-color: #f2f2f2;
  }
  &.active {
    background-color: #f2f2f2;
  }
`;

const PopperResultTitle = styled.a`
  color: ${Theme.primaryText};
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  overflow: hidden;
  margin-top: 10px;
  display: -webkit-box;
  width: 150px;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  cursor: pointer;
  &:hover {
    text-decoration: none;
  }
`;

const PopperResultDescription = styled.p`
  color: ${Theme.secondaryText};
  font-size: 10px;
  overflow: hidden;
  display: -webkit-box;
  margin-top: 5px;
  width: 150px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;
const PopperTitle = styled.h3`
  color: ${Theme.primaryText};
  font-size: 16px;
  margin-bottom: 5px;
  margin-top: 10px;
  margin-left: 0px;
`;

const PopperAdContainer = styled.div`
  flex: 2;
  background: url("https://docs.citrix.com/assets/images/image-5.png") no-repeat;
  background: white;
`;

const PopperAdImage = styled.img`
  width: 100%;
`;

const PopperResultItem = styled.li`
  width: 100%;
  list-style: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  padding: 10px;
  border-radius: 5px;
  &:hover {
    background-color: #f2f2f2;
  }
  &.active {
    background-color: #f2f2f2;
  }

  &:hover ${PopperResultTitle} {
    text-decoration: none;
  }
`;

const PopperResultImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  object-position: center;
  background-color: #f2f2f2;
`;

const PopperSeeMore = styled.span`
  font-size: 13px;
  font-family: inherit;
  font-weight: 300;
  color: dimgray;
  opacity: 0.8;
  margin-top: 30px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: 1px solid #e9e9e9;
  padding: 5px 15px;
  border-radius: 5px;
  &:hover {
    opacity: 1;
    color: dimgray;
    background-color: #f2f2f2;
  }

  

`

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const SearchButton = styled(Button)`
  height: 43px;
  margin-left: 10px;
`


const EndButtons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding: 0 4px;
`

const ClearButton = styled(IconButton)`
  transform: scale(0.75);
  padding: 0;
`

const SearchIconStyled = styled(SearchIcon)`
  width: 12px;
  margin-right: 5px;
  margin-top: 4px;
`;

const CenteredDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;