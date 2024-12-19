import React, { useState } from 'react';
import Cart from './Cart';
import { useCart } from './CartContext';
import { CartRecommendationsList, FrequentlyViewedTogetherList } from '../Recommendations/ProductRecommendations';

const CartPage = () => {
  const {cartItems} = useCart();
  let skus = [];
  const [rerender, setRerender] = useState(false)

  cartItems.forEach((item)=>{
    skus.push(item.sku)
  })

  return (
    <>
    <Cart setRerender={setRerender}/>
    <CartRecommendationsList skus = {skus} rerender={rerender} title={"Cart Recommendations"}/>
    </>
  );
};

export default CartPage;
