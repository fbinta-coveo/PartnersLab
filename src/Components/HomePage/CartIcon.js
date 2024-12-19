import React, { useState } from 'react';
import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../CartPage/CartContext';

const CartIcon = () => {

const {cartItems} = useCart();
  const getTotalCartQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Badge
    badgeContent={getTotalCartQuantity()}
    color="primary"
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    sx={{
      '& .MuiBadge-badge': {
        fontSize: '0.7rem',
        minWidth: '16px',
        height: '16px',
        borderRadius: '8px',
      },
    }}
  >
    <IconButton color="inherit" aria-label="Cart" onClick={()=>window.open('/cart',"_self")}>
      <ShoppingCartIcon fontSize="small" />
    </IconButton>
  </Badge>
  );
};

export default CartIcon;
