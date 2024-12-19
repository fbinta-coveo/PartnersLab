import React, { useEffect, useContext } from "react";
import { buildTab, Tab } from "@coveo/headless";
import EngineContext from "../../common/engineContext";
import styled from "styled-components";
import { Theme } from "../../config/theme";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchPageTabConfig } from "../../config/SearchConfig";
import { SearchPageTabConfigType } from "../../config/Types/ConfigTypes";
import { SearchPageTabConfigTranslations } from "../../config/InternationalizationConfig";
import { LanguageContext } from "../Internationalization/LanguageUtils";


export const encodeCustomSearchTab = (tab: string)=>{
  return tab.replace(/\s/g, "")
}

const isRouteMatching = (param: string, caption: string) => {

  if (!param && caption === SearchPageTabConfig[0].caption) {
    return true;
  }
  return param &&
  encodeCustomSearchTab(caption).toLowerCase() === param.toLowerCase()
    ? true
    : false;
};

interface SearchTabType {
  item: SearchPageTabConfigType;
  controller: Tab;
  selected: boolean;
}

export const SearchTab: React.FC<SearchTabType> = ({
  controller,
  item,
  selected,
}) => {
  const navigate = useNavigate();
  const { getText } = useContext(LanguageContext);

  return (
    <TabTitle
      key={item.caption}
      onClick={() => {

        if(item.commerceTab){
          window.location.href = "/search";
          return;
        }

        /* navigate(`/search/${encodeCustomSearchTab(item.caption)}${window.location.hash}`); */
        window.location.href = `/search/${encodeCustomSearchTab(item.caption)}${window.location.hash}#tab=${encodeURI(item.caption)}`;
        if (!selected) {
          controller.select();
        }
      }}
      isActive={selected}
    >
      {
        // @ts-ignore
        getText(item.caption, SearchPageTabConfigTranslations[_.camelCase(item.caption.toLowerCase())], "caption")
      }
    </TabTitle>
  );
};

interface SearchTabsType {
  filterSelected: string;
}

const SearchTabs: React.FC<SearchTabsType> = ({ filterSelected }) => {
  const engine = useContext(EngineContext)!;
  return (
    <Wrapper>
      {SearchPageTabConfig.map((item) => {
        const controller = buildTab(engine, {
          options: {
            id: item.caption,
            expression: item.expression,
          },
        });

        return (
          <React.Fragment key={item.caption}>
            <SearchTab
              item={item}
              controller={controller}
              selected={isRouteMatching(filterSelected, item.caption)}
            ></SearchTab>
          </React.Fragment>
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  background-color: #F6F1EB !important;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 300;
  flex-wrap: wrap;
  height: auto;
  padding : 5px;
`;
const TabTitle = styled.button<{ isActive: boolean }>`
  margin: 6px 6px;
  padding: 16px;
  font-size: 13px;
  height: 13px;
  font-weight: 500;
  border: none;
  border-bottom: 3px solid transparent;
  background: ${(props) => (props.isActive ? 'white' : 'none')}; 
  display: flex;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  /* color: ${(props) => (props.isActive ? 'black' : `${Theme.searchTabText}`)}; */
  color:#000;
  transition: 0.2s ease-in-out color, 0.2s ease-in-out border-bottom, 0.2s ease-in-out background;
  &:hover {
    border-bottom: 3px solid ${Theme.primary};
    opacity: 1;
  }
`;

export default SearchTabs;

// cursor: pointer;
// font-family: inherit;
// padding: 15px 20px;
// text-align: center;





