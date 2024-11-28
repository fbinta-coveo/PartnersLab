import HeroImage from "../assets/QMULHERO.jpg";
import CoveoLogo from "../assets/CoveoLogo.svg";
import QmulLogo from "../assets/QmulLogo.jpg";
import RecommendationDefault from "../assets/RECOMMENDATIONSQMUL.png";
import { RecommendationType } from "./Types/ConfigTypes";

/* To import your Demo Logo
1. Place the logo in the assets Folder
2. import the logo into this file using the following statement

    import DemoLogo from "../assests/<Logo-Image-filename>"  

    * it is important to add the coorect image extension type in the end of the filename e.g. DemoImage.png, DemoImage.svg or DemoImage.jpg

3. Replace the CoveoLogo with DemoLogo below.
*/

export const HeaderLogo = QmulLogo;

export const FooterLogo = QmulLogo;

export const DefaultRecommendationImage = RecommendationDefault;

// TODO When generating JSON, dynamically generate internationalization config in admin console to include these elements.
export const HeaderConfig = [
  {
    title: "STUDY",
    redirectTo: "/home",
  },
  {
    title: "ABOUT",
    redirectTo: "/",
  },
  {
    title: "RESEARCH",
    redirectTo: "/",
  },
  {
    title: 'FIND AN EXPERT',
    redirectTo: "/",
  },
  {
    title: 'DOCS',
    redirectTo: "/docs",
  }
];

export const HeroConfig = {
  title: "Explore our campuses",
  description: "At Queen Mary, you get the safety and security of campus life, while living in one of the most exciting parts of London.",
  background: HeroImage,
  buttonText: "JOIN QUEEN MARY",
  onClickButtonRedirect: "/search",
  width : "100%",
  height: "700px",

  // Hero Image Text CSS config
  titleFontSize : "32px",
  titleFontWeight : "600",
  titleColor : '#FFFFFF',
  titleWidth : "600px",
  subTitleWidth : "550px",
  subTitleFontSize : "16px",
  subTitleColor : '#FFFFFF'

};

export const MainRecommendationConfig: RecommendationType = {
  title: "Recommendations",
  description: "Here are your personalized recommendations",
  numberOfResults: 8,
  imageField: "blogimage",
  pipeline: "default",
  searchHub: "default",
  id: "Recommendation",
  active : true,      // changing to "false" will hide this recommendation
  type: "normal"       // changing to "carousel" will show the recommendations in a courosel. It can only be "normal" or "carousel"
};

export const VideoRecommendationConfig: RecommendationType = {
  title: "Videos",
  description: "Here are your personalized recommendations",
  numberOfResults: 8,
  imageField: "ytthumbnailurl",
  pipeline: "Video Rec Sidebar",
  searchHub: "default",
  id: "Recommendation",
  active : true ,     // changing to "false" will hide this recommendation
  type: "normal"     // changing to "carousel" will show the recommendations in a courosel. It can only be "normal" or "carousel"
};

export const EnableAuthentication = false;
