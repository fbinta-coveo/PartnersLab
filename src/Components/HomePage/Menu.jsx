import * as React from 'react';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { getOrganizationEndpoints } from '@coveo/headless';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {useEffect, useState} from "react";
import {initializeCommerceHeadlessEngine} from "../../common/Engine";
import {CommerceEngine} from "@coveo/headless/commerce";

export default function SlidingMenu() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false); // Tracks if the drawer is open
  const [openMainCategories, setOpenMainCategories] = React.useState([]); // Tracks open main categories
  const [openSubCategories, setOpenSubCategories] = React.useState([]); // Tracks open subcategories
  const [menuItems, setMenuItems] = React.useState({}); // State for storing grouped menu items
  const [error, setError] = React.useState(null); // Tracks errors during fetch
  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open); // Open or close the drawer
    if (!open) {
      setOpenMainCategories([]); // Reset open main categories when closing
      setOpenSubCategories([]); // Reset open subcategories when closing
    }
  };

  const toggleMainCategory = (mainCategory) => {
    setOpenMainCategories((prevState) =>
      prevState.includes(mainCategory)
        ? prevState.filter((category) => category !== mainCategory) // Close if open
        : [...prevState, mainCategory] // Open if closed
    );
  };

  const toggleSubCategory = (subCategory) => {
    setOpenSubCategories((prevState) =>
      prevState.includes(subCategory)
        ? prevState.filter((category) => category !== subCategory) // Close if open
        : [...prevState, subCategory] // Open if closed
    );
  };

  const fetchListings = async () => {
    const LISTINGS = localStorage.getItem("LISTINGS");
    if (!LISTINGS) {
    try {
      setError(null); // Reset errors before fetching
      const organizationEndpoints = getOrganizationEndpoints(
        process.env.REACT_APP_ORGANIZATION_ID || 'MISSING__ORG_ID'
      );

      const response = await fetch(
        `${organizationEndpoints.admin}/rest/organizations/${process.env.REACT_APP_ORGANIZATION_ID}/commerce/v2/configurations/listings?trackingId=${process.env.REACT_APP_COMMERCE_ENGINE_TRACKING_ID}&page=0&perPage=100`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${process.env.REACT_APP_GET_PRODUCT_LISTING_API_KEY}` },
        }
      );
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();

      if (!json || !json.items || json.items.length === 0) {
        throw new Error('No items received from API.');
      }
      let valid_listings = []
      for (const item of json.items) {
        if (item.patterns[0].url!="/") {
        const payload = {
          "trackingId": "sandbox",
          "language": "en",
          "country": "GB",
          "currency": "GPB",
          "clientId": "e04bb879-4c3a-4ae8-947b-8aa2b54052c5",
          "facets": [],
          "page": 1,
          "perPage": 30,
          "sort": {
            "sortCriteria": "relevance"
          },
          "debug": false,
          "context": {
            "user": {
              "userAgent": "Mozilla/5.0"
            },
            "view": {
              "url": item.patterns[0].url,
              "referrer": "https://hermes-coveo.netlify.app"
            },
            "cart": [],
            "source": [],
            "refreshCache": false,
            "capture": true,
            "labels": {}
          }
        };
        const single_listing_response = await fetch(
            `https://partnercommercesandbox5r4mhlrv.coveo.com/rest/organizations/partnercommercesandbox5r4mhlrv/commerce/v2/listing`,
            {
              method: 'POST',
              headers: {
                'accept': '*/*',
                'Authorization': 'Bearer x6ae4bcb8-93f5-41f9-a151-d4fb1237aa5d',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
            }
        );
        const json_single = await single_listing_response.json();
        if (json_single.pagination.totalEntries>0) {
          valid_listings.push(item)
        }
        }
      }
      // Group items by their hierarchical categories
      const groupedItems = valid_listings.reduce((acc, item) => {
        const parts = item.name.split('|'); // Split the name into parts
        if (parts.length === 0) {
          console.warn('Skipping item with invalid name:', item);
          return acc; // Skip invalid items
        }

        const mainCategory = parts[0]; // The first part is always the main category
        const subCategory = parts[1] || null; // Second part is the subcategory (if available)
        const detail = parts[2] || null; // Third part is the detail (if available)

        if (!acc[mainCategory]) {
          acc[mainCategory] = {}; // Initialize the main category
        }

        if (subCategory) {
          if (!acc[mainCategory][subCategory]) {
            acc[mainCategory][subCategory] = { details: [], isClickable: true }; // Initialize the subcategory
          }

          if (detail) {
            acc[mainCategory][subCategory].details.push({
              ...item,
              detailName: detail,
            }); // Add the detail
            acc[mainCategory][subCategory].isClickable = false; // Mark as not directly clickable
          } else {
            acc[mainCategory][subCategory].url = item.patterns?.[0]?.url || null; // Add the direct link URL
          }
        }

        return acc;
      }, {});

      setMenuItems(groupedItems);// Update state with grouped items
      localStorage.setItem("LISTINGS", JSON.stringify(groupedItems));
    } catch (e) {
      console.error('Error fetching or processing menu items:', e);
      setError(e.message);
    }
    } else
      setMenuItems(JSON.parse(LISTINGS))
  };

  React.useEffect(() => {
       fetchListings(); // Fetch listings when the component mounts
  }, []);

  // If there's an error, display it
  if (error) {
    return <div>Error: {error}</div>;
  }

  // If no menu items are available yet, show a loading state
  if (!menuItems || Object.keys(menuItems).length === 0) {
    return <div>Loading...</div>;
  }

  
  return (
    <div>
      {/* Button to open the drawer */}
      <Button onClick={toggleDrawer(true)} sx={{ cursor: 'pointer' }}>
        Menu
      </Button>

      {/* Drawer Component */}
      <Drawer
        anchor="left" // Slide in from the left
        open={isDrawerOpen}
        onClose={toggleDrawer(false)} // Close drawer when clicking outside
        sx={{
          '& .MuiDrawer-paper': {
            width: '500px', // Drawer width
            padding: '26px', // Internal padding
          },
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={toggleDrawer(false)}
          sx={{
            position: 'absolute',
            top: '8px',
            right: '8px',
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Main Menu Content */}
        <div>
          <h1>Menu</h1>
          {Object.keys(menuItems).map((mainCategory) => (
            <div key={mainCategory}>
              {/* Main Category Button */}
              <Button
                onClick={() => toggleMainCategory(mainCategory)}
                sx={{
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  paddingTop:"28px",
                  paddingLeft:"8px",
                  textAlign: 'left',
                  width: '100%',
                  fontWeight: openMainCategories.includes(mainCategory) ? 'bold' : 'normal',
                }}
              >
                {mainCategory}
                {/* Expand/Collapse Icon */}
                {openMainCategories.includes(mainCategory) ? (
                  <RemoveIcon />
                ) : (
                  <AddIcon />
                )}
              </Button>

              {/* Subcategories */}
              {openMainCategories.includes(mainCategory) &&
                Object.keys(menuItems[mainCategory]).map((subCategory) => (
                  <div key={subCategory} style={{ paddingLeft: '16px' }}>
                    {menuItems[mainCategory][subCategory].isClickable ? (
                      // Clickable Subcategory (no details)
                      <Button
                        onClick={() => {
                          const url = menuItems[mainCategory][subCategory].url;
                          if (url) {
                            window.open(url.replace('https://sports.barca.group', ''), '_self');
                          }
                        }}
                        sx={{
                          display: 'flex', 
                          justifyContent: 'space-between',
                          textAlign: 'left',
                          width: '100%',
                          fontWeight: 'normal',
                          cursor: 'pointer',
                        }}
                      >
                        {subCategory}

                      </Button>
                    ) : (
                      // Expandable Subcategory (with details)
                      <Button
                        onClick={() => toggleSubCategory(subCategory)}
                        sx={{
                          display: 'flex', // Flex to align text and icon
                          justifyContent: 'space-between',
                          textAlign: 'left',
                          width: '100%',
                          fontWeight: openSubCategories.includes(subCategory) ? 'bold' : 'normal',
                        }}
                      >
                        {subCategory}
                        {/* Expand/Collapse Icon */}
                        {openSubCategories.includes(subCategory) ? (
                          <RemoveIcon />
                        ) : (
                          <AddIcon />
                        )}
                      </Button>
                    )}

                    {/* Details under Subcategory */}
                    {!menuItems[mainCategory][subCategory].isClickable &&
                      openSubCategories.includes(subCategory) &&
                      menuItems[mainCategory][subCategory].details.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (item.patterns && item.patterns[0]?.url) {
                              const url = item.patterns[0].url.replace(
                                'https://sports.barca.group',
                                ''
                              );
                              window.open(url, '_self');
                            }
                          }}
                          style={{
                            paddingLeft: '32px',
                            paddingTop:"10px",
                            paddingBottom:"10px",
                            fontSize: '16px',
                            cursor: 'pointer',
                          }}
                        >
                          {item.detailName || item.name}
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}