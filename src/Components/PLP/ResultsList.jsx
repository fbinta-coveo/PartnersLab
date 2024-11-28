import React, { useEffect, useState } from "react";
import { initializeCommerceEngine } from "../../common/Engine";
import { CommerceEngine, buildProductListing } from "@coveo/headless/commerce";
import { Grid  } from "@mui/material";
import ResultTemplate, { ResultSkeleton } from "../../config/ResultTemplate";

const ResultRenderer = ({ controller }) => {
    const [products, setProducts] = React.useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        controller.subscribe(()=>{ 
            setProducts(controller.state.products)
            setLoading(false);
        })
    }, []);

    return (
    <>
        <Grid container spacing={2} mt={1} maxWidth={1300} style={controller.state.isLoading ? { opacity: 0.2} : {}}>
            {loading ? (
                <>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => {
                        return <ResultSkeleton key={index} />;
                    })}
                </>
            ) : (
                <>
                    {products.map((product) => {
                        return <ResultTemplate controller={controller} product={product} key={product.permanentid} />;
                    })}
                </>
            )}
        </Grid>
    </>
    );

};

const Results = ({engine}) => {

    const [controller, setController] = React.useState(null);
    useEffect(()=>{
          const controller = buildProductListing(engine);
          controller.refresh();
          setController(controller);
      },[])

      if(controller === null) return (<div>Loading...</div>)

    return (
        <ResultRenderer controller={controller}/>
    );
};

export default Results;