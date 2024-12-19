import React, { useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Paper, IconButton, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from './CartContext';
import CoveoAnalytics from '../../helper/CoveoAnalytics';
import { normalizeForCart } from '../../helper/Product.spec';

const Cart = ({setRerender}) => {
  const {cartItems, setCartItems,clearCart} = useCart()

  const calculateTotalPrice = () => {
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    return totalPrice.toFixed(2);
  };
  

  const handleIncreaseQuantity = (itemId) => {

    const cartItem = cartItems.find((item)=> item.id === itemId);
    CoveoAnalytics.addToCart({...cartItem.coveoua, quantity : cartItem.quantity + 1}, "add")
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    setRerender(prev => !prev)

  };

  const handleDecreaseQuantity = (itemId) => {
    const cartItem = cartItems.find((item)=> item.id === itemId);
    if(cartItem.quantity > 1){
      CoveoAnalytics.addToCart({...cartItem.coveoua, quantity : cartItem.quantity - 1}, "remove")
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item
      ).filter((item) => item.quantity > 0)
    );
    setRerender(prev => !prev)
  };

  const handleCheckout =()=>{
    const products = cartItems.map((item)=> {
      return {...item.coveoua, quantity : item.quantity}
    });
    CoveoAnalytics.addProductForPurchase(products);
    CoveoAnalytics.setActionPurchase({
      id : "transaction-id",
      revenue : calculateTotalPrice(),
      currencyCode : 'CAD'
    })
    clearCart();
    setTimeout(()=>{
      window.open('/home',"_self")
    },100)
    
  }

  return (
    <Container maxWidth="lg" sx={{ pt:20, display: 'flex', flexDirection: 'row', gap: 4 }}>
      {/* Left Column - Cart Items */}
      <div style={{ flex: 1 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Shopping Cart
        </Typography>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {cartItems.map((item) => (
            <ListItem key={item.id} sx={{ borderRadius: 1, transition: 'background-color 0.2s', '&:hover': { backgroundColor: '#f5f5f5' } }}>
              <ListItemAvatar sx={{ marginRight: 2 }}>
                <Avatar alt={item.name} src={item.imageUrl} sx={{ width: 100, height: 100, borderRadius: 0 }} />
              </ListItemAvatar>
              <ListItemText  sx={{maxWidth : '480px'}} onClick={()=>window.open('/pdp/' + item.id,"_self")}
                primary={item.name}
                secondary={item.description}
              />
              <ListItemText
                primary={`$${item.price} x ${item.quantity}`}
              />
              <IconButton
                aria-label="Decrease"
                color="primary"
                onClick={() => handleDecreaseQuantity(item.id)}
              >
                <RemoveIcon />
              </IconButton>
              <IconButton
                aria-label="Increase"
                color="primary"
                onClick={() => handleIncreaseQuantity(item.id)}
              >
                <AddIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </div>

      {/* Right Column - Summary */}
      <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: 1, backgroundColor: '#f8f8f8', minWidth: '250px', alignItems: 'center' }}>
        <Typography variant="h6">
          Summary
        </Typography>
        <Divider />
        <Typography>
          Subtotal: ${calculateTotalPrice()}
        </Typography>
        {/* Add more summary details here, like tax and delivery */}
        <Divider />
        <Typography>
          Tax: $2.50
        </Typography>
        <Divider />
        <Typography>
          Delivery: Free
        </Typography>
        <Divider />
        <Button variant="contained" color="primary" onClick={handleCheckout}>
          Checkout
        </Button>
      </Paper>
    </Container>
  );
};

export default Cart;