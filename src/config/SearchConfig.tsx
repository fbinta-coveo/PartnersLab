
/* 
FieldToIncludesInSearchResults helps you add more fields to the result templates. 
When setting imageField in this file, make sure the field is included in the FieldToIncludesInSearchResults array. 

The fields 'date', 'ytthumbnailurl', 'sysfiletype' should NOT be removed. 
*/

export const websiteContextValue = process.env.REACT_APP_COMMERCE_ENGINE_TRACKING_ID;

export const FieldToIncludesInSearchResults: string[] = [
  "sfanswer__c",
  "sfid",
  "sysfiletype",
  "date",
  "is_visible",
  "has_stock",
  "ytthumbnailurl",
  "adspecial",
  "ytthumbnailurl",
  "ytvideoduration","pdp", "dictField"
];


export const NoResultRecommendationConfig = {
  heading : "Popular Results",
  pipeline : "cmh-search-hermes_us",
  searchHub : "default",
  NumberofResults : 4,
  imageField : "ec_images",
  excerptField : "ec_description",
  showQuerySuggestion : true 
}

export const SearchBarTitle = "What can we help you find?"

export const SpeechToText = false;



//---------------------------- FOR CONTENT SEARCH ----------------------------

export const EnableContentSearch = true;

export const SearchPageTabConfig: any[] = [
  {
    caption: "Products",
    expression: "",
    isActive: true,
    commerceTab  : true
  },
  {
    caption: "Content",
    expression: "",
    isActive: false,
    commerceTab  : false
  },

];


export const DefaultSideBarRecommendationConfig: any[] =
  []; /* [{
  pipeline: "IRS test",
  NumberofResults: 5,
  title: "Related for Investing",
  videoRecommendation: true,
  imageField: 'ytthumbnailurl'
}] */

export const ResultsImageField = "ec_images"; // mainly required for eCommerce use cases


export const ImageToText = false;

export const EnableSmartSnippetToggle = false;

export const EnableGenQAToggle = true;

export const EnableDebugMode = false;

export const EnableRecentQueries = true;

export const EnableRecentResultList = true;

