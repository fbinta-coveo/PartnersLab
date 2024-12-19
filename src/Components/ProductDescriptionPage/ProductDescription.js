// import React, { useState } from 'react';
// import { Card, CardContent, Grid, Typography, Button, Select, MenuItem } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../CartPage/CartContext';
// import CoveoAnalytics from '../../helper/CoveoAnalytics';
// import { normalizeForCart, normalizeProduct } from '../../helper/Product.spec';
// import Breadcrumbs from './Breadcrumbs';
// import StarRating from './StarRating';


// const ProductDescription = ({result}) => {

//   const navigate = useNavigate();

//   const {addToCart, cartItems} = useCart();

//   const handleQuantityChange = (event) => {
//     setQuantity(event.target.value);
//   };

//   const existingCartItem = cartItems.find((item) => item.id === result.raw.cat_sku);
//   const [quantity, setQuantity] = useState(existingCartItem? existingCartItem.quantity : 1);

//   const cardStyle = {
//     margin: '50px auto',
//     maxWidth : '1800px'
//   };

//   const imageStyle = {
//     width: '80%',
//     height: 'auto',
//     margin: '20px'
//   };

//   const rightColumnStyle = {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     textAlign: 'left', // For larger screens, align the text to the left
//     '@media (maxWidth: 960px)': {
//       alignItems: 'center', // For smaller screens, align the content to the center
//       textAlign: 'center',
//     },
//   };

//   const keyFeaturesStyle = {
//     marginBottom: 16,
//     '@media (max-width: 960px)': {
//       marginBottom: 8,
//     },
//   };

//   const priceStyle = {
//     marginTop: 16,
//     '@media (maxWidth: 960px)': {
//       marginTop: 8,
//     },
//   };

//   const addToCartStyle = {
//     marginTop: 16,
//     '@media (maxWidth: 960px)': {
//       marginTop: 8,
//     },
//   };

//   return (
//     <Card style={cardStyle}>
//       <CardContent>
//         <Grid container spacing={2}>
//           {/* Left column - Image */}
//           <Grid item xs={12} md={6}>
//             <img
//               src={result.raw.ec_images}
//               alt={result.raw.ec_name}
//               style={imageStyle}
//             />
//           </Grid>
//           {/* Right column - Details */}
//           <Grid item xs={12} md={6} style={rightColumnStyle}>
//             <Typography variant="h5" component="h2" style={{ marginBottom: 16 }}>
//               {result.raw.ec_name}
//             </Typography>
//             <Typography variant="body1" color="textSecondary" style={{ marginBottom: 16 }}>
//                 {result.excerpt}
//             </Typography>
//             {result.raw.ec_rating && <StarRating initialRating={Number(result.raw.ec_rating)} />}
// {/*             <Typography variant="h6" component="h3" style={keyFeaturesStyle}>
//               Key Features:
//             </Typography>
//             <Typography variant="body2" color="textSecondary" component="ul" style={{ paddingLeft: 20 }}>
//               <li>Powerful Intel Core i7 processor</li>
//               <li>15.6" Full HD display</li>
//               <li>16GB RAM and 512GB SSD</li>
//               <li>Long-lasting battery life</li>
//             </Typography> */}
//             {result.raw.ec_price? 
//             <Typography variant="h6" component="h3" style={priceStyle}>
//               Price: ${result.raw.ec_price}
//             </Typography>
//             : null}
//             <Typography variant="body2" color="textSecondary">
//               In Stock. Free Shipping.
//             </Typography>
//             <div style={addToCartStyle}>
//           {existingCartItem ? (
//             <>
//               <Typography variant="body2" color="textSecondary" style={{ marginBottom: 8 }}>
//                 Item is in cart with quantity: {existingCartItem.quantity}
//               </Typography>
//               <Select
//                 value={quantity}
//                 onChange={handleQuantityChange}
//                 style={{ marginRight: 16 }}
//               >
//                 {[...Array(10).keys()].map((qty) => (
//                   <MenuItem key={qty + 1} value={qty + 1}>
//                     {qty + 1}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => {
//                   addToCart({
//                     id: result.raw.permanentid,
//                     name: result.raw.ec_name,
//                     price: result.raw.ec_price,
//                     quantity: quantity,
//                     description: null,
//                     imageUrl: result.raw.ec_images,
//                     sku : result.raw.permanentid,
//                     coveoua : normalizeForCart(result, quantity)
//                   });
//                   CoveoAnalytics.addToCart(normalizeForCart(result, quantity), "add")
//                 }}
//               >
//                 Add to Cart
//               </Button>
//             </>
//           ) : (
//             <>
//               <Select
//                 value={quantity}
//                 onChange={handleQuantityChange}
//                 style={{ marginRight: 16 }}
//               >
//                 {[...Array(10).keys()].map((qty) => (
//                   <MenuItem key={qty + 1} value={qty + 1}>
//                     {qty + 1}
//                   </MenuItem>
//                 ))}
//               </Select>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => {
//                   addToCart({
//                     id: result.raw.permanentid,
//                     name: result.raw.ec_name,
//                     price: result.raw.ec_price,
//                     quantity: quantity,
//                     description: null,
//                     imageUrl: result.raw.ec_images,
//                     sku : result.raw.permanentid,
//                     coveoua : normalizeForCart(result, quantity)
//                   });
//                   CoveoAnalytics.addToCart(normalizeForCart(result, quantity), "add")
//                 }}
//               >
//                 Add to Cart
//               </Button>
//             </>
//           )}
//         </div>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProductDescription;


import React, { useState } from 'react';
import { Grid, Typography, Button, Select, MenuItem, Accordion, AccordionSummary, AccordionDetails, Box, Link } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BorderBottom } from '@mui/icons-material';

const ProductDescription = ({ result }) => {
  const [selectedImage, setSelectedImage] = useState(result.raw.ec_images[0]); 
  const [quantity, setQuantity] = useState(1);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const imageStyle = {
    width: '70%',
    cursor: 'pointer',
    marginBottom: '10px',
    border: '1px solid #ccc',
  };

  const selectedImageStyle = {
    ...imageStyle,
  };

  return (
    <Grid
      container
      spacing={2}
      style={{
        maxWidth: "80%",
        margin: '0 auto',
        padding: '20px',
      }}
    >
      {/* image gallery */}
      <Grid item xs={2}  style={{ paddingLeft: '50px'}}>
        {result.raw.ec_images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Product Thumbnail ${index}`}
            style={selectedImage === image ? selectedImageStyle : imageStyle}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </Grid>

      {/* main img */}
      <Grid item xs={6}>
        <img
          src={selectedImage}
          alt="Main Product"
          style={{
            width: '100%',
            border: '1px solid #ccc',
          }}
        />
      </Grid>

      {/* pdp section */}
      <Grid
        item
        xs={4}
        style={{
          // backgroundColor: 'red',
          paddingLeft: "110px",
        }}
      >
        {/* top section */}
        <Box
          sx={{
            width:"400px",
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: 'white', 
          }}
        >
          <Typography variant="h5" style={{ marginBottom: '10px' }}>
            {result.raw.ec_name}
          </Typography>
          <Typography variant="h6" style={{ marginBottom: '10px', fontSize:"15px", color:"grey"}}>
            ${result.raw.ec_price}
          </Typography>

          {/* <Select
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ marginBottom: '20px', width: '70px', height:"30px"}}
          >
            {[...Array(10).keys()].map((qty) => (
              <MenuItem key={qty + 1} value={qty + 1}>
                {qty + 1}
              </MenuItem>
            ))}
          </Select> */}

          {/* Add to Cart */}
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft:"100px",marginTop:"30px", marginBottom: '20px' }}
          >
            Add to Cart
          </Button>
        </Box>

        {/* 2nd box */}
        <Box
          sx={{
            width:"400px",
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: 'white', 
          }}
        >
          {/* pdp */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Product Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{result.raw.ec_description || 'No additional details available.'}</Typography>
            </AccordionDetails>
          </Accordion>

          {/* Delivery & Returns */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Delivery & Returns</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Easy and complimentary, within 14 days</Typography>
            </AccordionDetails>
          </Accordion>

          {/* Gifting */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Gifting</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>All orders are delivered in an orange box wrapped in a Bolduc ribbon, excluding fragrance, makeup and beauty products, calendar products, books, Hermès Editeur objects, large objects and certain equestrian items. Hermès Editeur objects are delivered in a box including a book and a certificate of authenticity.
During checkout, you can include a card with a personalized message and a priceless invoice.
A customer can exchange a gift. For more details, please contact our Customer Service. </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Product Reference */}
          <Typography variant="body2" style={{ marginTop: '20px' }}>
            Product reference: <strong>{result.raw.sku}</strong>
          </Typography>
          <Link
            href="/contact-us"
            variant="body2"
            style={{ marginTop: '10px', display: 'block' }}
          >
            Like to know more? Contact Customer Service
          </Link>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProductDescription;
