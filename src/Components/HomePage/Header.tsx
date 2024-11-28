import React, { useContext, useEffect, useState } from "react";
import { Theme } from "../../config/theme";
import { Icon } from "react-icons-kit";
import { search } from "react-icons-kit/feather/search";
import { x } from "react-icons-kit/feather/x";
import { useNavigate } from "react-router-dom";
import { HeaderConfig, HeaderLogo } from "../../config/HomeConfig";
import { CustomContextContext } from "../CustomContext/CustomContextContext";
import Fade from "@mui/material/Fade";
import Popover from "@mui/material/Popover";
import styled from "styled-components";
import ContextForm from "../CustomContext/ContextForm";
import HomeResultsSearchBox from "./HomeResultsSearchBox";
import HomeProductsSearchBox from "./HomeProductsSearchBox";
import HomeSearchBox from "./HomeSearchBox";
import _ from 'lodash';
import { HomeHeaderConfigTranslations, InternationalizationEnabled } from "../../config/InternationalizationConfig";
import { LanguageContext } from "../Internationalization/LanguageUtils";
import { InternationalizationDropdown } from "../Internationalization/InternationalizationDropdown";

const Header: React.FC = () => {
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const navigate = useNavigate();
  const { getProfile } = useContext(CustomContextContext);
  const { getText } = useContext(LanguageContext);
  const onSearchPage = window.location.pathname.includes("search");
  const toggleSearchBox = () => {
    if (onSearchPage) {
      const input = document.querySelector(".search-box input");
      if (input instanceof HTMLElement) {
        input.focus();
      }
      return;
    }
    setOpenSearch(!openSearch);
  };

  useEffect(() => {
    if (openSearch) {
      const input = document.querySelector(".home-search-box input");
      if (input instanceof HTMLElement) {
        input.focus();
      }
    }
  }, [openSearch]);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Wrapper>
        <Logo src={HeaderLogo} onClick={() => navigate("/home")} />
        <RightWrapper>
          <LinkWrapper>
            {HeaderConfig.map((item) => {
              return (
                <NavigationLink key={item.title} href={item.redirectTo}>
                  {
                    // @ts-ignore
                    getText(item.title, HomeHeaderConfigTranslations[_.camelCase(item.title)], "title")
                  }
                </NavigationLink>
              );
            })}
            <IconsWrapper>
              <IconContainer
                style={{ cursor: "pointer" }}
                onClick={() => toggleSearchBox()}
              >
                {openSearch && !onSearchPage ? (
                <div style={{ color: Theme.searchIcon }}><Icon icon={x} size={24} /></div>
                ) : (
                  <div style={{ color: Theme.searchIcon }}><Icon icon={search} size={24} /></div>
                )}
              </IconContainer>
              <ProfileIconContainer
                style={{ color: 'black', cursor: "pointer" }}
                aria-describedby={id}
                onClick={(event)=>handleClick(event)}
              >
                <ProfileAvatar src = {getProfile().profile} alt = {'profile pic'}/>
                <ProfileName>{getProfile().name.split(' ').slice(0, -1).join(' ')}</ProfileName>
              </ProfileIconContainer>
              <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <ContextForm/>
                </Popover>
                {InternationalizationEnabled && <InternationalizationDropdown/>}
            </IconsWrapper>
          </LinkWrapper>
        </RightWrapper>
      </Wrapper>
      <Fade in={openSearch && !onSearchPage}>
        <SearchContainer>
          <SearchBoxContainer>
            {!onSearchPage && 
             <HomeSearchBox toggleSearchBox={toggleSearchBox} /> 
            }
          </SearchBoxContainer>
        </SearchContainer>
      </Fade>
    </>
  );
};

const Wrapper = styled.header`
  box-shadow: 0 2px 8px rgb(229 232 232 / 75%);
  position: fixed;
  top: 0;
  z-index: 99;
  padding: 12px 0;
  width: 100%;
  max-height: 64px;
  color: ${Theme.primaryText};
  background-color: #ffffff;
  display: flex;
  align-items: center;
  transition: max-height .3s ease-out;
`;

const Logo = styled.img`
  height: 50px;
  width: 150px;
  object-fit: contain;
  padding-left: 10px;
`;

const RightWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
  margin-right: 50px;
`;

const LinkWrapper = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 850px;
  @media (max-width: 1000px) {
    width: auto;
  }
`;

const NavigationLink = styled.a`
  color: ${Theme.primaryText};
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  opacity: 1;
  transition: 0.2s ease-in-out all;
  &:hover {
    opacity: 0.7;
  }
  @media (max-width: 1000px) {
    display: none;
  }
`;

const Divider = styled.div`
  height: 50px;
  border-right-width: 2px;
  width: 1px;
  height: 48px;
  background: #e5e8e8;
  @media (max-width:1000px) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  width: 100%;
  height: 150px;
  margin-top: 10px;
  box-shadow: 0px 6px 16px rgba(229, 232, 232, 0.75);
  display: flex;
  flex-direction: row;
  align-items: center;
  position: absolute;
  background-color: white;
  justify-content: center;
  position: fixed;
  z-index: 9;
`;

const IconsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const IconContainer = styled.button`
background: none;
border: 0px;
width: 40px;
transition: 0.2s ease-in-out all;
&:hover{
  transform: scale(0.95);
}
&:active{
  transform: scale(0.85);
}
`

const ProfileName = styled.span`
font-size  : 16px;
font-weight: 400;
font-family: inherit;
margin-left: 15px;
color : ${Theme.secondaryText};
text-overflow: ellipsis;
@media (max-width: ${Theme.mobileSize}px){
  display: none;
}
`


const ProfileIconContainer = styled.button`
  background: none;
  border: 0px;
  margin-left: 20px;
  width: 90px;
  display: flex;
  align-items: center;
  transition: 0.2s ease-in-out all;
  &:hover{
  transform: scale(0.95);
}
&:active{
  transform: scale(0.85);
}
@media (max-width: ${Theme.mobileSize}px) {
  width: 40px;
}

`

const SearchBoxContainer = styled.div`
  width: 50%;
  margin-top: 50px;
  max-width: 800px;
  min-width: 500px;
  @media (max-width: 480px) {
    min-width: 80vw;
  }
`;


const ProfileAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 24px;
  object-fit: cover;
`

export default Header;
