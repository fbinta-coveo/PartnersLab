import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import { Theme } from '../../config/theme';

const Breadcrumbs = ({ categories }) => {
  const lastCategory = categories[categories.length - 1];
  const newcat = lastCategory.split("|");

  const buildUrl = (pathArray) => {
    const urlPath = pathArray.map(encodeURIComponent).join(',');
    return `/search/All#tab=All&cf-custurlnav=${urlPath}`;
  };

  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      {newcat.length > 1 ? (
        newcat.map((category, index, array) => (
          <Anchor
            key={index}
            component={RouterLink}
            href={buildUrl(array.slice(0, index + 1))}
          >
            {category}
          </Anchor>
        ))
      ) : (
        <Typography color="textPrimary">{lastCategory}</Typography>
      )}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;

const Anchor = styled.a`
color : ${Theme.primary};
`



