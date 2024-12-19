import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import {
  initializeCommerceHeadlessEngine,
  initializeHeadlessEngine,
} from "./common/Engine";
import { SearchEngine } from "@coveo/headless";
import { CommerceEngine } from "@coveo/headless/commerce";
import HomePage from "./Components/HomePage/HomePage";
import Header from "./Components/HomePage/Header";
import { CommerceEngineProvider, EngineProvider } from "./common/engineContext";
import SearchPage from "./Components/SearchPage/SearchPage";
import Footer from "./Components/HomePage/Footer";
import CustomContextProvider, {
  settingContextFromEngineFirstTime,
} from "./Components/CustomContext/CustomContextContext";
import { Theme } from "./config/theme";
import {
  LanguageContextProvider,
  LanguageContext,
} from "./Components/Internationalization/LanguageUtils";
import DocsPage from "./Components/HomePage/DocsPage";
import PLP from "./Components/PLP/PLP";
import { CartProvider } from "./Components/CartPage/CartContext";
import PDPage from "./Components/ProductDescriptionPage/ProductDescriptionPage";
import Cart from "./Components/CartPage/CartPage";
import ContentSearchPage from "./Components/ContentSearchPage/SearchPage";
import { AtomicSearchInterface } from "@coveo/atomic-react";
import { EnableContentSearch, FieldToIncludesInSearchResults } from "./config/SearchConfig";
import { CoveoStandardTranslations, FacetTranslations, InternationalizationEnabled } from "./config/InternationalizationConfig";


export default function App() {
  const [engine, setEngine] = React.useState<SearchEngine | null>(null);
  const [commerceEngine, setCommerceEngine] =
    React.useState<CommerceEngine | null>(null);

  const setCustomTranslations = (i18n: any, elementTranslations: any) => {
    if (typeof elementTranslations != 'object' || elementTranslations == null)
      return console.error("Unable to set custom translations as value isn't a valid object (Using default settings)")  

    for (const key in elementTranslations) {
      const element = elementTranslations[key];
      const languagesDetected: string[] = Object.keys(element);
      if (!languagesDetected || languagesDetected.length == 0)
        continue;

      languagesDetected.forEach((language) => {
        i18n.addResourceBundle(language, 'translation', {
          [key]: element[language]
        });
      })
    }
  }

  const setFacetTranslations = (i18n: any, facetConfig: any) => {
    if (typeof facetConfig != 'object' || facetConfig == null)
      return console.error("Unable to set custom facet translations as value isn't valid");

    for (const key in facetConfig) {
      const facet = facetConfig[key];
      if (!facet.hasOwnProperty("values"))
        continue;
      const values = facet["values"];
      Object.keys(values).forEach((language: any) => {
        i18n.addResourceBundle(language, `caption-${key}`, values[language])
      });
    }
  }

  useEffect(() => {
    initializeHeadlessEngine().then((engine) => {
      settingContextFromEngineFirstTime(engine);
      setEngine(engine);
    });

    initializeCommerceHeadlessEngine().then((engine) => {
      setCommerceEngine(engine);
    });
  }, []);

  return (
    <>
      {commerceEngine && engine ? (
        <EngineProvider value={engine}>
          <CommerceEngineProvider value={commerceEngine}>
            <LanguageContextProvider>
              <LanguageContext.Consumer>
                {({ selectedLanguage }) => (
                                  <AtomicSearchInterface engine = {engine} fieldsToInclude={FieldToIncludesInSearchResults} language={selectedLanguage}
                                  /* Example to add translations */
                                    localization={(i18n) => {
                                      if (!InternationalizationEnabled)
                                        return;
                                      setCustomTranslations(i18n, CoveoStandardTranslations)
                                      setFacetTranslations(i18n, FacetTranslations)
                                    }}
                                  >
                                    <style>{AtomicTheme}</style>
                    <CartProvider>
                      <CustomContextProvider>
                        <Router>
                          <Header />
                          <Routes>
                            <Route
                              path="/"
                              element={
                                <Navigate
                                  to={
                                    isEnvValid() === true ? "/home" : "/error"
                                  }
                                  replace
                                />
                              }
                            />
                            <Route path="/home" element={<HomePage />} />
                            <Route
                              path="/search"
                              element={<SearchPage engine={commerceEngine} />}
                            />
                           {EnableContentSearch && (
                          <Route
                            path="/search/:filter"
                            element={<ContentSearchPage engine={engine} />}
                          />
                          )}
                            <Route path="/plp/:filter" element={<PLP />} />
                            <Route
                              path="/plp/:filter/:secondfilter"
                              element={<PLP />}
                            />
                            <Route
                              path="/plp/:filter/:secondfilter/:thirdfilter"
                              element={<PLP />}
                            />
                            <Route
                              path="/pdp/:permanentid"
                              element={<PDPage engine={engine} />}
                            />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/error" element={<Error />} />
                            <Route path="/docs" element={<DocsPage />} />
                          </Routes>
                          <Footer />
                        </Router>
                      </CustomContextProvider>
                    </CartProvider>
                    </AtomicSearchInterface>
                )}
              </LanguageContext.Consumer>
              
            </LanguageContextProvider>
          </CommerceEngineProvider>
        </EngineProvider>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
}

const isEnvValid = () => {
  const variables = [
    "REACT_APP_PLATFORM_URL",
    "REACT_APP_ORGANIZATION_ID",
    "REACT_APP_COMMERCE_ENGINE_API_KEY",
    "REACT_APP_USER_EMAIL",
    "REACT_APP_SERVER_PORT",
  ];
  const reducer = (previousValue: boolean, currentValue: string) =>
    previousValue && Boolean(process.env[currentValue]);
  return variables.reduce(reducer, true);
};

const Error = () => {
  return (
    <Box height="100vh" display="flex" align-items="center">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item md={9} sm={11}>
          <div className="container">
            <Typography variant="h4" color="error">
              Invalid Environment variables
            </Typography>
            <Typography variant="body1">
              You should have a valid <code>.env</code> file at the root of this
              project. You can use <code>.env.example</code> as starting point
              and make sure to replace all placeholder variables
              <code>&#60;...&#62;</code> by the proper information for your
              organization.
            </Typography>
            <p>
              Refer to the project <b>README</b> file for more information.
            </p>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

const AtomicTheme = `
:root {
  --atomic-font-family: inherit;
  --atomic-primary : ${Theme.primary};
  --atomic-on-background : ${Theme.primaryText};
  --atomic-primary-light : ${Theme.primary}80;
  --atomic-primary-dark : ${Theme.primary};
  --atomic-neutral-dark : ${Theme.secondaryText}
  
 }
`;
