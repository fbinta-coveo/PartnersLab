import exp from "constants";
import {
  DefaultSideBarRecommendationConfigType,
  SearchPageTabConfigType,
} from "./Types/ConfigTypes";

/* 
FieldToIncludesInSearchResults helps you add more fields to the result templates. 
When setting imageField in this file, make sure the field is included in the FieldToIncludesInSearchResults array. 

The fields 'date', 'ytthumbnailurl', 'sysfiletype' should NOT be removed. 
*/

export const FieldToIncludesInSearchResults: string[] = [
  "sfanswer__c",
  "sfid",
  "sysfiletype",
  "date",
  "adimage",
  "ytthumbnailurl",
  "sfimage__c",
  "sfimage_url__c",
  "adspecial",
  "ytthumbnailurl",
  "ytvideoduration","pdp", "dictField","imageField"
];

/* 
SearchPageTabConfig helps you configure the Tabs. Each object represent a new Tab.

 - caption -> Name of the Tab
 - expression -> query expression to show in the Tab
 - isActive -> To be active initially when search page loads up
 - sideBarRecommendationConfig -> Can add multiple recommendation in the side bar


You can leave the Array empty if you don't want any tabs

*/
export const SearchPageTabConfig: SearchPageTabConfigType[] = [
  {
    caption: "All",
    expression: "",
    isActive: true,
    sideBarRecommendationConfig: [
      {
        pipeline: "Video Rec Sidebar",
        searchHub: "default",
        NumberofResults: 3,
        title: "Related Videos",
        videoRecommendation: true,
        imageField: "ytthumbnailurl",
      },
    ]
  },
  {
    caption: "Events & Webinars",
    expression: `@title='event'`,
    isActive: false,
    facetToInclude: ["author","source"]
  },
  {
    caption: "Resources",
    expression: `@syslanguage='english' AND @concepts=("webinar","communications", "resources")`, // Should we change sys language to lang?
    isActive: false,
    sideBarRecommendationConfig: [
      {
        pipeline: "Service Sidebar",
        searchHub: "default",
        NumberofResults: 6,
        title: "Glossary"
      },
    ]
  },
  {
    // Since this field isn't in the configuration file, we can omit it as the last parameter.
    caption: "SharePoint",
    expression: "@documenttype='ListItem'",
    isActive: false,
  },
  {
    // Since this field isn't in the configuration file, we can omit it as the last parameter.
    caption: "Blog",
    expression: "@clickableuri='blog'",
    isActive: false,
  },
  {
    caption: "Newsroom",
    expression: `@concepts="product news"`,
    isActive: false,
  },
  {
    caption: "Support & Training",
    expression: `@source=="Advisor"`,
    isActive: false,
  },
  {
    caption: "YouTube",
    expression: `@filetype=="youtubevideo"`,
    isActive: false,
  },
];

/* 
DefaultSideBarRecommendationConfig is used if you want to show same sideBar recommendation on each tab.
*/

export const DefaultSideBarRecommendationConfig: DefaultSideBarRecommendationConfigType[] =
  []; /* [{
  pipeline: "IRS test",
  NumberofResults: 5,
  title: "Related for Investing",
  videoRecommendation: true,
  imageField: 'ytthumbnailurl'
}] */

export const NoResultRecommendationConfig = {
  enable : true,
  heading : "Popular Results",
  pipeline : "default",
  searchHub : "default",
  NumberofResults : 3,
  imageField : "",
  excerptField : "excerpt",
  showQuerySuggestion : true 
}

export const ResultsImageField = "ec_images"; // mainly required for eCommerce use cases

export const SearchBarTitle = "What can we help you find?"

export const SpeechToText = false;

export const ImageToText = false;

export const EnableSmartSnippetToggle = true;

export const EnableGenQAToggle = true;

export const EnableDebugMode = false;

export const EnableRecentQueries = true;

export const EnableRecentResultList = true;