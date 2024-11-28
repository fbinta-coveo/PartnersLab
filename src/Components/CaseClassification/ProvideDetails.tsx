import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Collapse from '@mui/material/Collapse';
import { Box } from "@mui/system";

interface ProvideDetailsProps {
  description : string,
  progress: number
}

const ProvideDetails: React.FC<ProvideDetailsProps> = ({description, progress}) => {
  const [expand, setExpand] = useState<boolean>(false);

  const handleExpand = () => {
    setExpand((prev) => !prev);
  };

  return (
    <Grid  minHeight = {'200px'} >
      <Grid container alignItems={"center"} >
      <Box sx={{ position: 'relative' }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        }}
        size={40}
        thickness={4}
        value={100}
      />
      <CircularProgress
        variant="determinate"
        value={progress > 100? 100 : progress}
        sx={{
          position: 'absolute',
          left: 0,
        }}
        size={40}
        thickness={4}
      />
      </Box>

        <Typography ml ={'20px'} sx = {{fontWeight : "bold"}}>Provide Details</Typography>
      </Grid>
      <Grid mt={"5px"} ml ={'50px'} container width={"300px"} >
        <div style = {{display : 'flex'}}>
        <div style = {{width : '90px'}}>
        {!expand ? (
          <ExpandMoreIcon onClick={handleExpand} />
        ) : (
          <ExpandLessIcon onClick={handleExpand} />
        )}
        </div>
        <div>
        <Typography >Don't know what to write?</Typography>
        <Collapse in={expand}>
          <Typography sx = {{fontSize: '1rem'}}> 
            {description}
          </Typography>
        </Collapse>
        </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default ProvideDetails;
