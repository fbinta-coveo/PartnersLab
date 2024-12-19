import { buildSearch } from "@coveo/headless/commerce";
import { useContext, useEffect, useState } from "react";
import { CommerceEngineContext } from "../../common/engineContext";
import ResultTemplate, { ResultSkeleton } from "../../config/CommerceResultTemplate";
import { Grid } from "@mui/material";
import NoResult from "./NoResult";

const ResultsListRenderer = ({ controller }) => {
  const [state, setState] = useState(controller.state);

  useEffect(() => {
    controller.subscribe(() => {
      setState(controller.state);
    });
  }, []);


    if (state.products.length === 0 && !state.isLoading) {
        return <NoResult />;
    }

return (
    <>
         <Grid container spacing={0} mt={1} maxWidth={1300} sx={{opacity : state.isLoading? "0.5" : "1"}}>
                {controller.state.isLoading ? (
                    <>
                    {state.products.length === 0 ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => {
                            return <ResultSkeleton key={index} />;
                        }) : state.products.map((product) => {
                            return <ResultTemplate controller ={controller} product={product} key={product.permanentid} />;
                        })}
                    </>
                ) : (
                    <>
                        {state.products.map((product) => {
                            return <ResultTemplate controller ={controller} product={product} key={product.permanentid} />;
                        })}
                    </>
                )}
            </Grid>
    </>
    );
};

const ResultsList = ({ engine }) => {
  const controller = buildSearch(engine);

  if (controller === null) return <div>Loading...</div>;
  return <ResultsListRenderer controller={controller} />;
};

export default ResultsList;