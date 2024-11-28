import {buildSearchEngine, getOrganizationEndpoints} from '@coveo/headless';
import {buildCaseAssistEngine} from '@coveo/headless/case-assist';
import {
  PlatformClient,
  RestUserIdType,
  TokenModel,
} from '@coveord/platform-client';
import { KEY_NAME_CONTEXT_DATA, KEY_NAME_PROFILE_SELECTED } from '../config/ProfileConfig';
import { buildCommerceEngine } from '@coveo/headless/commerce';

const PROFILE_SELECTED : string | null = localStorage.getItem(KEY_NAME_PROFILE_SELECTED);
const CONTEXT_DATA = localStorage.getItem(KEY_NAME_CONTEXT_DATA);
let USER_ID_EMAIL = "";


if(CONTEXT_DATA !==null && CONTEXT_DATA.length > 0 && typeof PROFILE_SELECTED === 'string'){
  USER_ID_EMAIL =  JSON.parse(CONTEXT_DATA).filter((item : any)=>{
    return item.name === JSON.parse(PROFILE_SELECTED);
  })[0].email;
}






const getEndpointToLocalServer = () => {
  if (!process.env.REACT_APP_SERVER_PORT) {
    throw new Error('Undefined "REACT_APP_SERVER_PORT" environment variable');
  }
  const port = process.env.REACT_APP_SERVER_PORT;
  const pathname = '/token';
  return `http://localhost:${port}${pathname}`;
};

const getTokenEndpoint = () => {
  return process.env.REACT_APP_TOKEN_ENDPOINT || getEndpointToLocalServer();
};

export async function getSearchToken() {

  
  /* const res = await fetch(getTokenEndpoint()); */
  /* const {token} = await res.json(); */

  const res = await ensureClientTokenGenerated();
  const {token} = res;

  return token;
}

// Not used in the GDE-CAPI but kept here for reference
export async function initializeHeadlessEngine() {
  return buildSearchEngine({
    configuration: {
      organizationEndpoints : getOrganizationEndpoints(process.env.REACT_APP_ORGANIZATION_ID!),
      organizationId: process.env.REACT_APP_ORGANIZATION_ID!,
      accessToken: await getSearchToken(),
      renewAccessToken: getSearchToken,
      search :{
        searchHub : "default",
      }
    },
  });
}


export async function initializeCommerceHeadlessEngine() {

  return buildCommerceEngine({
    configuration: {
      organizationEndpoints : getOrganizationEndpoints(process.env.REACT_APP_ORGANIZATION_ID!),
      organizationId: process.env.REACT_APP_ORGANIZATION_ID!,
      accessToken: await getSearchToken(),
      renewAccessToken: getSearchToken,
      context: {
        //@ts-ignore
        currency : process.env.REACT_APP_COMMERCE_ENGINE_CURRENCY,
        country: process.env.REACT_APP_COMMERCE_ENGINE_COUNTRY,
        language : process.env.REACT_APP_COMMERCE_ENGINE_LANGUAGE,
        view: {
          url: process.env.REACT_APP_COMMERCE_ENGINE_URL + window.location.pathname,
        },
      },
      analytics : {
        trackingId : process.env.REACT_APP_COMMERCE_ENGINE_TRACKING_ID,

      }
    },
  });
}


async function ensureClientTokenGenerated() {
  const platform: PlatformClient = new PlatformClient({
      /**
       * The Plaform URL to use.
       * https://platform.cloud.coveo.com is the default platform host.
       * However, you can target a different environment by changing the host value.
       *
       * Example:
       * Use "https://platformhipaa.cloud.coveo.com" if you want to target the HIPAA environment.
       *
       * You can also target a different region (e.g. https://platform-au.cloud.coveo.com)
       * See https://docs.coveo.com/en/2976/coveo-solutions/deployment-regions-and-strategies#data-residency
       */
      host: process.env.REACT_APP_PLATFORM_URL,
      /**
       * The unique identifier of your Coveo organization.
       * To retrieve your org ID, see https://docs.coveo.com/en/148/manage-an-organization/retrieve-the-organization-id
       */
      organizationId: process.env.REACT_APP_ORGANIZATION_ID,
      /**
       * An API key with the impersonate privilege in the target organization.
       * See https://docs.coveo.com/en/1718/manage-an-organization/manage-api-keys#add-an-api-key
       */
      accessToken: process.env.REACT_APP_COMMERCE_ENGINE_API_KEY!,
    });

  /*   try{ */

  const response  = await platform.search.createToken({
      /****** Mandatory parameters ******/
      /**
       * The security identities to impersonate when authenticating a query with this search token.
       * The userIds array should contain at least one security indentity.
       * See https://docs.coveo.com/en/56/#userids-array-of-restuserid-required
       */
      userIds: [
        {
          name: USER_ID_EMAIL? USER_ID_EMAIL : process.env.REACT_APP_USER_EMAIL!,
          provider: 'Email Security Provider',
          type: RestUserIdType.User,
        },
      ],

      /****** Optional parameters ******/
      /**
       * The name of the search hub to enforce when authenticating a query with this search token.
       * The search hub is a descriptive name of the search interface on which the token is to be used.
       *See https://docs.coveo.com/en/56/#searchhub-string-optional

       * Example:
       * searchHub: 'supporthub',
       */
       /* searchHub: 'Finance', */
      /**
       * The filter query expression to apply when authenticating a query with this search token.
       * See https://docs.coveo.com/en/56/#filter-string-optional
       *
       * Example:
       * filter: 'NOT @source="my secured source"',
       */
    })
   /*  .then((data: TokenModel) => {
      token =  data.token;
    })
    .catch((err) => {
     console.log('error in token ',err)
     token = null
    }); */
      return response;
    
 /*  } */
  /* catch(err){
    console.log('error in generating search token')
    return 'error'
  } */
}

export async function initializeCaseAssitsEngine() {
  return  buildCaseAssistEngine({
    configuration :{
    organizationId: process.env.REACT_APP_ORGANIZATION_ID!,
    caseAssistId : '1d54e047-c458-4d8b-aa36-0e52c81f5523',
    accessToken: await getSearchToken(),
    renewAccessToken: getSearchToken,
    }
  });
}