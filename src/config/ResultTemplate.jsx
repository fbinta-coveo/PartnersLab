import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Rating, Chip, Skeleton } from '@mui/material';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  border: 1px solid #f5f5f5;
  box-shadow: 0 0px 2px 0 rgba(0,0,0,0.1);

  &:hover {
    cursor: pointer;
    box-shadow: 0 0px 5px 2px rgba(0,0,0,0.1);
  }
`;

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
`;

const VariantContainer = styled.div`
  display: flex;
  gap: 5px;
  margin: 5px 0;
`

const Variant = styled.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
  border-radius: 5px;
  border: 1px solid #f5f5f5;
`

const formatPrice = (price) => {
  return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
};

const ResultTemplate = ({ controller, product }) => {
  const [productImage, setProductImage] = React.useState(product.ec_images[0]);
  const interactiveResult = controller.interactiveProduct({options :{
    product: product,
  }})

  return (
    <StyledGrid item xs={12} sm={6} md={3} p={1} key={product.permanentid}>
      <StyledCard onClick={() => {
        interactiveResult.select()
        window.open(product.clickUri)
        }}>
        <CardMedia
          component="img"
          height="250px"
          image={productImage} 
          alt={product.ec_name}
        />
        <CardContent>
          <Typography gutterBottom variant="h7" sx={{ fontWeight: "600" }} component="div">
            {product.ec_name}
          </Typography>
          {product.ec_rating && <Rating name="read-only" value={product.ec_rating} size="small" readOnly />}
          { product.ec_price &&
            (<Typography variant="h6" color="text.secondary">
              $ {product.ec_price}
            </Typography>)
          }
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            >
            {product.ec_description}
          </Typography>
            <VariantContainer>
            {
              product.children.length > 0 && product.children.slice(1,6).map((variant) => (
                <Variant src={variant.ec_images[0]}
                  key={variant.permanentid}
                  alt={variant.ec_name}
                  onMouseOver={() => setProductImage(variant.ec_images[0])}
                  onMouseOut={() => setProductImage(product.ec_images[0])}
                  onClick={() => window.open(variant.clickUri)}
                 />
              ))
            }
            </VariantContainer>
          {product.ec_brand && <Chip label={product.ec_brand} size='small' sx={{ marginTop: "15px", borderRadius: "3px" }} />}
        </CardContent>
      </StyledCard>
    </StyledGrid>
  );
};

export const ResultSkeleton = () => {
  return (
    <StyledGrid item xs={12} sm={6} md={3} p={1}>
      <StyledCard>
          <Skeleton variant="rectangular" width={"100%"} height={"270px"} />
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <Skeleton variant="rounded" width={210} height={20} />
              <Skeleton variant="rounded" width={150} height={20} />
              <Skeleton variant="rounded" width={70} height={30} />
              <Skeleton variant="rounded" width={210} height={50} />
              <Skeleton variant="rounded" width={70} height={20} />
          </CardContent>
      </StyledCard>
    </StyledGrid>
  );
}

export default ResultTemplate;
