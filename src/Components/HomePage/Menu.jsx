import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { getOrganizationEndpoints } from '@coveo/headless';

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [menuitems, setmenuitems] = React.useState([]);

  const fetchlistings = async ()=>{

    try{
            const organizationEndpoints = getOrganizationEndpoints(
        process.env.REACT_APP_ORGANIZATION_ID || 'MISSING__ORG_ID'
      );
      const plpListResponse = await fetch(
        new URL(
          `${organizationEndpoints.admin}/rest/organizations/${process.env.REACT_APP_ORGANIZATION_ID}/commerce/v2/configurations/listings?trackingId=${process.env.REACT_APP_COMMERCE_ENGINE_TRACKING_ID}&page=0&perPage=100`,
        ),
        { method: 'GET', headers: { Authorization: `Bearer ${process.env.REACT_APP_GET_PRODUCT_LISTING_API_KEY}` } },
      );
    
      const json = await plpListResponse.json();
      if(json){
        setmenuitems(json.items);
      }
    }
    catch(e){
      console.log(e);
    }
}

  React.useEffect(()=>{

    fetchlistings();

  },[])

  if(menuitems.length === 0){
    return null;
  }

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onMouseOver={handleClick}
      >
        Products
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        { menuitems && menuitems.map((item, index)=>{
            if(item.name === "GLOBAL"){
                return null;
            }
            return <MenuItem key={item.id} onClick={()=>window.open(item.patterns[0].url.replace("https://sports.barca.group",""), "_self")}>{item.name}</MenuItem>
        })}
      </Menu>
    </div>
  );
}