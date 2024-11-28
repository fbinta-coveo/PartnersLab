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
import { initializeCommerceHeadlessEngine, initializeHeadlessEngine } from "./common/Engine";
import { SearchEngine } from "@coveo/headless";
import { CommerceEngine } from "@coveo/headless/commerce";
import HomePage from "./Components/HomePage/HomePage";
import Header from "./Components/HomePage/Header";
import { CommerceEngineProvider, EngineProvider } from "./common/engineContext";
import SearchPage from "./Components/SearchPage/SearchPage";
import Footer from "./Components/HomePage/Footer";
import QuickViewModal from "./Components/SearchPage/QuickViewModal";
import QuickViewModalProvider from "./Components/SearchPage/QuickViewModalContext";
import CustomContextProvider, {  settingCommerceContextFromEngineFirstTime, settingContextFromEngineFirstTime } from "./Components/CustomContext/CustomContextContext";
import { Theme } from "./config/theme";
import { LanguageContextProvider, LanguageContext } from "./Components/Internationalization/LanguageUtils";
import DocsPage from "./Components/HomePage/DocsPage";
import PLP from "./Components/PLP/PLP";


export default function App() {
  const [engine, setEngine] = React.useState<SearchEngine | null>(null);
  const [commerceEngine, setCommerceEngine] = React.useState<CommerceEngine | null>(null);

  useEffect(() => {
    initializeHeadlessEngine().then((engine) => {
      settingContextFromEngineFirstTime(engine)
      setEngine(engine);
    }); 

    initializeCommerceHeadlessEngine().then((engine) => {
      settingCommerceContextFromEngineFirstTime(engine)
      setCommerceEngine(engine);
    });
  }, []);

  return (
    <>
      {(commerceEngine && engine) ? (
        <EngineProvider value={engine}>
          <CommerceEngineProvider value={commerceEngine}>
          <LanguageContextProvider>
            <LanguageContext.Consumer>
              {({ selectedLanguage }) => (
                  <QuickViewModalProvider>
                    <CustomContextProvider>
                      <Router>
                        <Header />
                        <QuickViewModal />
                        <Routes>
                          <Route
                            path="/"
                            element={
                              <Navigate
                                to={isEnvValid() === true ? "/home" : "/error"}
                                replace
                              />
                            }
                          />
                          <Route path="/home" element={<HomePage />} />
                          <Route
                            path="/search"
                            element={<SearchPage engine={commerceEngine} />}
                          />
                          <Route
                            path="/search/:filter"
                            element={<SearchPage engine={commerceEngine} />}
                          />
                          <Route
                          path ="/plp/:filter"
                          element={<PLP/>}
                          />
                          <Route
                            path="/plp/:filter/:secondfilter"
                            element={<PLP />}
                          />
                          <Route
                            path="/plp/:filter/:secondfilter/:thirdfilter"
                            element={<PLP />}
                          />
                          <Route path="/error" element={<Error />} />
                          <Route path="/docs" element={<DocsPage />} />
                          
                        </Routes>
                        <Footer/>
                      </Router>
                    </CustomContextProvider>
                  </QuickViewModalProvider>
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