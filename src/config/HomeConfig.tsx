import HeroImage from "../assets/Hero.png";
import CoveoLogo from "../assets/CoveoLogo.svg";
import HermesLogo from "../assets/HermesLogo.png"
import RecommendationDefault from "../assets/Recommendation.jpg";
import { RecommendationType } from "./Types/ConfigTypes";

/* To import your Demo Logo
1. Place the logo in the assets Folder
2. import the logo into this file using the following statement

    import DemoLogo from "../assests/<Logo-Image-filename>"  

    * it is important to add the coorect image extension type in the end of the filename e.g. DemoImage.png, DemoImage.svg or DemoImage.jpg

3. Replace the CoveoLogo with DemoLogo below.
*/

export const HeaderLogo = HermesLogo;

export const FooterLogo = HermesLogo;

export const DefaultRecommendationImage = RecommendationDefault;

// TODO When generating JSON, dynamically generate internationalization config in admin console to include these elements.
export const HeaderConfig = [
  {
    title: "Find a store",
    redirectTo: "/home",
  },
  {
    title: "Contact Us",
    redirectTo: "/home",
  },
];

export const HeroConfig = {
  title: "Sweet wonders",
  description: "A meeting of winter pleasures.",
  background: "#F6F1EB",
  buttonText: "Create your combination",
  onClickButtonRedirect: "/search",
  width : "100%",
  height: "1050px",

  // Hero Image Text CSS config
  titleFontSize : "32px",
  titleFontWeight : "600",
  titleColor : '#000000',
  titleWidth : "600px",
  subTitleWidth : "550px",
  subTitleFontSize : "16px",
  subTitleColor : '#000000'

};

export const HomeRecommendationConfig: RecommendationType[] = [

  {
    title: "",
    description: "",
    numberOfResults: 8,
    imageField: "ec_images",
    pipeline: "cmh-recommendations-sandbox",
    searchHub: "default",
    id: "Recommendation",
    active : true,       // changing to "false" will hide this recommendation
    type: "carousel" // "list" | "carousel" | "slider"
  },
  {
    title: "",
    description: "",
    numberOfResults: 8,
    imageField: "ec_images",
    pipeline: "cmh-recommendations-sandbox",
    searchHub: "default",
    id: "Recommendation",
    active : true,       // changing to "false" will hide this recommendation
    type: "list" // "list" | "carousel" | "slider"
  },
  {
    title: "",
    description: "",
    numberOfResults: 8,
    imageField: "ec_images",
    pipeline: "cmh-recommendations-sandbox",
    searchHub: "default",
    id: "Recommendation",
    active : true,       // changing to "false" will hide this recommendation
    type: "slider" // "list" | "carousel" | "slider"
  },







  // {
  //   title: "Recommendations",
  //   description: "Here are your personalized recommendations",
  //   numberOfResults: 15,
  //   imageField: "ec_images",
  //   pipeline: "cmh-search-hermes",
  //   searchHub: "default",
  //   id: "Recommendation",
  //   active : true,       // changing to "false" will hide this recommendation
  //   type: "carousel" // "list" | "carousel" | "slider"
  // },
  // {
  //   title: "Recommendations",
  //   description: "Here are your personalized recommendations",
  //   numberOfResults: 15,
  //   imageField: "ec_images",
  //   pipeline: "cmh-search-hermes",
  //   searchHub: "default",
  //   id: "Recommendation",
  //   active : true,       // changing to "false" will hide this recommendation
  //   type: "carousel" // "list" | "carousel" | "slider"
  // },
]

export const EnableAuthentication = false;
