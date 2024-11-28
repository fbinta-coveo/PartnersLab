import { FieldToIncludesInSearchResults } from "../SearchConfig";

export interface DefaultSideBarRecommendationConfigType {
    pipeline: string,
    searchHub : string,
    NumberofResults: number,
    title: string
    HomeBottomRecommendation? : boolean
    imageField? : typeof FieldToIncludesInSearchResults[number]
  }

  export interface NoResultRecommendationConfigType {
    enable : boolean,
    heading : string,
    pipeline : string,
    searchHub : string,
    NumberofResults : number,
    imageField : string | null,
    excerptField : string
  }



export interface FacetConfigType {
  field : string,
  title : string
}  


export interface FileTypeIconsConfigType {
  imageRef : string; 
}


export interface sideBarRecommendationConfigType {
  pipeline : string;
  searchHub : string;
  NumberofResults: number;
  title: string;
  HomeBottomRecommendation? : boolean
  imageField? : typeof FieldToIncludesInSearchResults[number]
}

export interface SearchPageTabConfigType {
  caption : string;
  expression : string;
  isActive : boolean;
  sideBarRecommendationConfig? : sideBarRecommendationConfigType[];
  facetToInclude? : String[];
}

export interface RecommendationType {
  title? : string,
  description? : string,
  numberOfResults?: number,
  imageField? : typeof FieldToIncludesInSearchResults[number],
  pipeline? : string,
  id? : string,
  searchHub : string,
  active : boolean
  type: "list" | "carousel" | "slider" 
}