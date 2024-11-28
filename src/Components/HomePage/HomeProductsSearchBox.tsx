import { FunctionComponent, useEffect, useState, useContext } from "react";
import TextField from "@mui/material/TextField";
import {
  SearchBox as HeadlessSearchBox,
  StandaloneSearchBoxOptions,
  buildSearchBox,
  loadSearchActions,
/*   loadSearchAnalyticsActions, */
  loadQueryActions,
  buildSearch,
  Search as CommerceSearch,
  buildInstantProducts
} from "@coveo/headless/commerce";
import EngineContext, { CommerceEngineContext } from "../../common/engineContext";
import { useNavigate } from "react-router-dom";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import styled from "styled-components";
import { ClickAwayListener, IconButton } from "@mui/material";
import { Theme } from "../../config/theme";
import Button from '@mui/material/Button';
import { Icon } from "react-icons-kit";
import { search } from "react-icons-kit/feather/search";
import {LanguageContext} from "../Internationalization/LanguageUtils";
import { HomeProductsSearchBoxTranslations } from "../../config/InternationalizationConfig";
import { HeaderLogo } from "../../config/HomeConfig";
import { SpeechRecognitionButton } from "../SearchPage/SpeechRecognitionButton";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from "@mui/icons-material/Search";
import { STANDALONE_SEARCHBOX_KEY } from "./HomeSearchBox";

const defaultSearchPageRedirect = ()=> window.open(`/search`, '_self')



interface HomeProductsSearchBoxProps {
  searchBoxController: HeadlessSearchBox;
  toggleSearchBox: () => void;
  resultsController : any
}

const HomeProductsSearchBoxRenderer: FunctionComponent<
    HomeProductsSearchBoxProps
> = (props) => {
  const { searchBoxController,resultsController } = props;
  const engine = useContext(CommerceEngineContext)!;
  const [state, setState] = useState(searchBoxController.state);
  const [searchTerm, setSearchTerm] = useState("");
  const [openPopper, setOpenPopper] = useState(false);
  const { getText } = useContext(LanguageContext);
  const [resultsState, setResultsState] = useState(resultsController.state);

  useEffect(
    () =>
      searchBoxController.subscribe(() => setState(searchBoxController.state)),
    [searchBoxController]
  );

  useEffect(
    () =>
      resultsController.subscribe(() => setResultsState(resultsController.state)),
    [resultsController]
  );





  useEffect(() => {
    const unsub = setTimeout(async () => {

      resultsController.updateQuery(searchTerm);

      localStorage.setItem(STANDALONE_SEARCHBOX_KEY, JSON.stringify({value: searchTerm}));
    
      searchBoxController.submit();

    }, 0);

    return () => clearTimeout(unsub);
  }, [searchTerm]);

  const onPressSearchButton = ()=>{
    props.toggleSearchBox();
    searchBoxController.submit();

    if(searchTerm === ""){
      defaultSearchPageRedirect()
      return;
    }

    defaultSearchPageRedirect()
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
              resultsController.updateQuery(newInputValue);
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
                  <SpeechRecognitionButton controller={searchBoxController} callback={defaultSearchPageRedirect}></SpeechRecognitionButton>
                </EndButtons>
              ),
            }}
            className="home-search-box"
            placeholder={getText("Search", HomeProductsSearchBoxTranslations, "searchPlaceholder")}
            size="small"
            onKeyDown={(e) => {
              if (
                e.code === "Enter" &&
                searchBoxController.state.value !== ""
              ) {
                props.toggleSearchBox();
                searchBoxController.submit();
                /* navigate("/search"); */
                defaultSearchPageRedirect()
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
                <PopperTitle>{getText("Suggested Searches", HomeProductsSearchBoxTranslations, "suggestedSearches")} </PopperTitle>
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
                            defaultSearchPageRedirect()
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
                    null
                  )}
              </PopperQSContainer>
              { resultsState.products.length > 0 && <PopperResultsContainer>
                <PopperTitle>{getText("Featured Results", HomeProductsSearchBoxTranslations, "featuredResults")}</PopperTitle>

                <ResultContainer>
                { resultsState.products.length > 0 ? 
                      <>
                          {resultsState.products.slice(0, 6).map((result) => {
                          let src: any = result.ec_images[0];
                          return (
                            <PopperResultItem
                              key = {result.permanentid}
                              onMouseDown={() => {
                                window.open(result.clickUri, "_blank");
                              }}
                            >
                              <PopperResultImage
                                  src={src ? src : HeaderLogo}
                                  style={src ? {} : {background: "#e9e9e9", objectFit: "contain", padding: "20px"}}
                                  alt={result.ec_name}
                               />
                              <PopperResultTitle
                                href={result.clickUri}
                                onMouseDown={() => {
                                  window.open(result.clickUri, "_blank");
                                }}
                              >
                                {result.ec_name}
                              </PopperResultTitle>
                              <PopperResultDescription>
                                {result.ec_description}
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
                  }}>{getText("More Results", HomeProductsSearchBoxTranslations, "moreResults")}
                  </PopperSeeMore>
                </CenteredDiv>
              </PopperResultsContainer>}
            
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

const HomeProductsSearchBox = ({ toggleSearchBox }: SearchBoxType) => {

  const options: StandaloneSearchBoxOptions = {
    numberOfSuggestions: 8,
    redirectionUrl: "/search",
  };


  const engine = useContext(CommerceEngineContext)!;
  const [searchBoxController, setSearchBoxController] = useState<HeadlessSearchBox | null>(null);
  const [resultsController, setResultsController] = useState<any | null>(null);

  useEffect(()=>{

    if(engine){
      setSearchBoxController(buildSearchBox(engine, { options }));
      setResultsController(buildInstantProducts(engine,{
        options :{
          cacheTimeout : 100
        }
      }))
    }
  
  },[engine])


  if(searchBoxController && resultsController){
    searchBoxController.updateText('');
    resultsController.updateQuery('');

    return (
      <HomeProductsSearchBoxRenderer
        searchBoxController={searchBoxController}
        toggleSearchBox={toggleSearchBox}
        resultsController={resultsController}
      />
    );
  }
  else{
    return null;
  
  }

};

export default HomeProductsSearchBox;

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
  font-size: 13px;
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