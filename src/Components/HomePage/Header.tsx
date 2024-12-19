import React, { useContext, useEffect, useState } from "react";
import { Theme } from "../../config/theme";
import styled from "styled-components";
import { Icon } from "react-icons-kit";
import { search } from "react-icons-kit/feather/search";
import HomeSearchBox from "./HomeSearchBox";
import { x } from "react-icons-kit/feather/x";
import Fade from "@mui/material/Fade";
import {  useNavigate } from "react-router-dom";
import { HeaderConfig, HeaderLogo } from "../../config/HomeConfig";
import Popover from "@mui/material/Popover";
import ContextForm from "../CustomContext/ContextForm";
import { CustomContextContext } from "../CustomContext/CustomContextContext";
import { CommerceEngine, buildProductListing } from "@coveo/headless/commerce";
import EngineContext from "../../common/engineContext";
import BasicMenu from "./Menu";
import HomeProductsSearchBox from "./HomeProductsSearchBox";
import { InternationalizationDropdown } from "../Internationalization/InternationalizationDropdown";
import { InternationalizationEnabled, HomeHeaderConfigTranslations } from "../../config/InternationalizationConfig";
import { LanguageContext } from "../Internationalization/LanguageUtils";
import { shoppingCart } from "react-icons-kit/feather/shoppingCart"; 
import { menu } from "react-icons-kit/feather/menu"; 
import CartIcon from "./CartIcon.js";



const Header: React.FC = () => {



/*   const plpListResponse = await fetch(
    new URL(
      `${organizationEndpoints.admin}/rest/organizations/${process.env.REACT_APP_ORGANIZATION_ID}/commerce/v2/configurations/listings?page=0&perPage=100`,
    ),
    { method: 'GET', headers: { Authorization: `Bearer ${process.env.PRODUCT_LISTING_API_KEY}` } },
  );

  const json = await plpListResponse.json();

  const urlValidator = /\/browse\/promotions\//;
  const validItems = json.items.filter((item) => urlValidator.test(item.matching.url));

  const listings = validItems.map((item) => {
    const splitUrl = item.matching.url.split('/');
    const name = splitUrl[splitUrl.length - 1].replace(/-/g, ' ').trim();

    return { name: name.charAt(0).toUpperCase() + name.slice(1), urls: [item.matching.url] };
  }); */





  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const navigate = useNavigate();
  const { getProfile } = useContext(CustomContextContext)
  const { getText } = useContext(LanguageContext)
  const onSearchPage = window.location.pathname.includes("search") || window.location.pathname.includes("browse") || window.location.pathname.includes("product") || window.location.pathname.includes("plp") 
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
      <TopWrapper>
        <RightWrapper>
          {InternationalizationEnabled && <InternationalizationDropdown/>}
          <ListingWrapper>
            {HeaderConfig.map((item, index) => {
                // if(index === 0) return <BasicMenu/>
              return (
                <NavigationLink key={item.title} href={item.redirectTo}>
                  {item.title && getText(item.title, HomeHeaderConfigTranslations, item.title)}
                </NavigationLink>
              );
            })}
          </ListingWrapper>
        </RightWrapper>
      </TopWrapper>

      <BtmWrapper>
        <Logo src={HeaderLogo} onClick={() => navigate("/home")} />
        <LeftWrapper>
          <IconsWrapper>
            <MenuContainer style={{ cursor: "pointer" }}>
                <div style={{ color: Theme.searchIcon }}>
                  <Icon icon={menu} size={24} />
                </div>
                {/* <MenuText>Menu</MenuText> */}
                <BasicMenu/>

            </MenuContainer>
          </IconsWrapper>

        </LeftWrapper>

        <RightWrapper>
          <IconsWrapper>
            <ProfileIconContainer
              style={{ color: 'black', cursor: "pointer" }}
              aria-describedby={id}
              onClick={(event)=>handleClick(event)}
            >
              <ProfileAvatar src = {getProfile().profile} alt = {'profile pic'}/>
              <ProfileName>{getProfile().name.split(' ').slice(0, -1).join(' ')}</ProfileName>
            </ProfileIconContainer>
            {/* <CartIcon/> */}

            <CartWrapper onClick={() => navigate("/cart")}>
            <Icon icon={shoppingCart} size={24} />
            <CartText>Cart</CartText>
          </CartWrapper>
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
          </IconsWrapper>
        </RightWrapper>
      </BtmWrapper>

      
          <SearchBoxContainer>
            {!onSearchPage && 
             <HomeProductsSearchBox toggleSearchBox={toggleSearchBox} /> 
            }
          </SearchBoxContainer>


    </>
  );
};

const TopWrapper = styled.header`
  /* box-shadow: 0 2px 8px rgb(229 232 232 / 75%); */
  position: fixed;
  top: 0;
  z-index: 99;
  padding: 12px 0;
  width: 100%;
  height: 40px;
  color: ${Theme.primaryText};
  background-color:rgb(246 241 235 / 73%);
  display: flex;
  align-items: center;
  transition: max-height .3s ease-out;
`;
const BtmWrapper = styled.header`
  position: fixed;
  top: 40px;
  z-index: 99;
  padding: 12px 0;
  width: 100%;
  height: 64px;
  background-color:rgb(246 241 235 / 73%);
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  position: absolute; 
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 50px;
  width: 150px;
  object-fit: contain;
  z-index: 999; 
`;

const LeftWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex: 1;
  margin-left: 20px;

`;


const NavigationLink = styled.a`
  color: ${Theme.primaryText};
  text-decoration: none;
  font-size: 10px;
  font-weight: 500;
  opacity: 1;
  transition: 0.2s ease-in-out all;
  &:hover {
    opacity: 0.95;
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
  background-color: red;
  justify-content: center;
  position: fixed;
  z-index: 9;
`;

const IconsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;



const ProfileName = styled.span`
font-size  : 16px;
font-weight: 400;
font-family: inherit;
margin-left: 15px;
color : ${Theme.secondaryText};
text-overflow: ellipsis;
`
const IconContainer = styled.button`
background: none;
border: 0px;
width: 40px;
transition: 0.2s ease-in-out all;
&:hover{
  opacity: 0.95;
}
&:active{
  opacity: 0.95;
}
`

const RightWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center; 
  flex: 1; 
  margin-right: 20px; 
`;

const LinkWrapper = styled.ul`
  display: flex;
  justify-content: space-evenly;
  align-items: center; 
  width: 300px;
  margin-right:30px;
  @media (max-width: 1000px) {
    width: auto;
  }
`;

const ListingWrapper = styled.ul`
  display: flex;
  justify-content: space-evenly;
  align-items: center; 
  width: 300px;
  margin-right:30px;
  @media (max-width: 1000px) {
    width: auto;
  }
`;

const CartWrapper = styled.button`
  margin-right: 80px;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  margin-left: 20px; 
  
  &:hover {
    transform: scale(0.95); 
  }

  &:active {
    transform: scale(0.85);
  }

  @media (max-width: 1000px) {
    justify-content: center;
  }
`;

const ProfileIconContainer = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: 0px;
  margin-left: 20px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(0.95);
  }

  &:active {
    transform: scale(0.85);
  }
`;


const CartText = styled.span`
  font-size: 16px;
  font-weight: 500;
  margin-left: 8px;
  color: ${Theme.primaryText};

  &:hover {
    opacity: 0.95;
  }
`;
const SearchBoxContainer = styled.div`
  position: fixed;
  margin-left:200px;
  top: 40px; 
  z-index: 100; 
  width: 400px;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
`;

const ProfileAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 24px;
  object-fit: cover;
`

const MenuContainer = styled.button`
  background: none;
  margin-left: 30px;
  border: 0px;
  display: flex;
  align-items: center;
  gap: 8px; 
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(0.95);
  }

  &:active {
    transform: scale(0.85);
  }
`;

const MenuText = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${Theme.primaryText};
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.8; 
  }
`;

export default Header;