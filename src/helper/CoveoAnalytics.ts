
export function _coveoua(...args) {
    // in case coveoua is blocked by AdBlock
    if (window && window['coveoua']) {
      window['coveoua'].call(this, ...args);
    }
  }
  
/*   import getConfig from 'next/config';
  const { publicRuntimeConfig } = getConfig();
  
  import cartStore from '../reducers/cartStore';
  
  import { User } from '../api/user-client-interface'; */
  
  interface AnalyticsProductData {
    name: string;
    id: string;
    brand: string;
    group: string;
    quantity?: number;
    price: number;
    category: string;
    variant: string;
  }
  
  export const getAnalyticsProductData = (product, sku = '', quantity = 0, withQuantity = true) => {
    let category = '';
    if (product?.ec_category?.length) {
      category = product.ec_category;
      category = category[category.length - 1];
    }
  
    // DOC: https://docs.coveo.com/en/l29e0540/coveo-for-commerce/tracking-commerce-events-reference#product-fields-reference
    const analyticsProductData: AnalyticsProductData = {
      name: product.ec_name,
      id: product.permanentid,
      brand: product.ec_brand,
      group: product.ec_item_group_id,
      price: product.ec_promo_price || product.ec_price,
      category: category,
      variant: sku,
    };
  
    if (withQuantity) {
      analyticsProductData['quantity'] = quantity;
    }
  
    return analyticsProductData;
  };
  
  const getOriginsAndCustomData = (dataToMerge?: any) => {
    const page = window.location.pathname;
    let originLevel2 = 'default';
  
    if (/^\/(browse|plp|pdp)\//.test(page)) {
      // starts with /browse/, /plp/, or /pdp/
      originLevel2 = page.substring(5);
    }
  
    const custom = {
      context_website: 'hermes_us',
      ...(dataToMerge || {}),
    };
  
    return {
      custom,
      searchHub: sessionStorage.getItem('pageType'),
      tab: originLevel2,
    };
  };
  
  const addProductForPurchase = (products: AnalyticsProductData[] | AnalyticsProductData) => {
    products = Array.isArray(products) ? products : [products];
    products.forEach((product) => {
      _coveoua('ec:addProduct', product);
    });
  };
  
  const addToCart = (products: AnalyticsProductData[] | AnalyticsProductData, action: 'add' | 'remove' = 'add') => {
    addProductForPurchase(products);
    _coveoua('ec:setAction', action);
    _coveoua('send', 'event'/* , getOriginsAndCustomData() */);
  };
  
  const removeFromCart = (products: AnalyticsProductData[] | AnalyticsProductData) => {
    addToCart(products, 'remove');
  };
  
  const detailView = (product : any, trackingid, customcontext) => {
    // using good old setTimeout to prevent an issue were detail and pageview get mixed
    setTimeout(() => {
      // Send the "pageview" event (measurement)
      // https://docs.coveo.com/en/l2pd0522/coveo-for-commerce/measure-events-on-a-product-detail-page
      _coveoua("set", "custom", { context_website: customcontext });
      _coveoua('set', 'trackingId', trackingid);
      _coveoua('ec:addProduct', product);
      _coveoua('ec:setAction', 'detail');
      _coveoua('send', 'event');
    }, 1);
  };
  
  const impressions = (product : any, searchUid : any) => {
    _coveoua('ec:addImpression', {
      ...product,
      list: `coveo:search:${searchUid}`,
    });
  };
  
  const logPageView = (customURL: string) => {
    _coveoua('set', 'page', customURL || window.location.pathname);
    _coveoua('send', 'pageview'/* , getOriginsAndCustomData() */);
  };
  
  //
  // Now using Classic click events
  // Keeping this next part commented in case we want the `/collect` clicks again.
  // [JIRA UNI-557]
  // const productClick = (product, searchUid: string, recommendationStrategy: string = '', callBack) => {
  //   const productData = {
  //     ...getAnalyticsProductData(product),
  //     position: product.index + 1,
  //   };
  //   coveoua('ec:addProduct', productData);
  //   coveoua('ec:setAction', 'click', {
  //     list: `coveo:search:${searchUid}`,
  //   });
  //   let customData: any = {};
  //   if (recommendationStrategy) {
  //     customData.recommendation = recommendationStrategy;
  //   }
  //   coveoua('send', 'event', getOriginsAndCustomData(customData));
  //   setTimeout(callBack, 5);
  // };
  
  const setActionPurchase = (purchasePayload) => {
    _coveoua('ec:setAction', 'purchase', purchasePayload);
    _coveoua('send', 'event'/* , getOriginsAndCustomData() */);
  };
  
  //
  // Get the visitor id from various sources (localStorage, cookies)
  //
  // We are generating a new visitorId until KIT-1208 is fixed to avoid
  // having analytics with differents visitor ids in the same session
  //
  export const getVisitorId = () => {
    if (typeof window !== 'object') {
      // analytics on server-side are disabled
      return '';
    }
  
    let visitorId: string = window!['coveo_visitorId'];
    if (!visitorId) {
      visitorId = window!['coveoanalytics']?.getCurrentClient()?.visitorId;
    }
  
    if (visitorId) {
      // save it for later
      window!['coveo_visitorId'] = visitorId;
    }
  
    return visitorId;
  };
  
/*   export const emitUV = (type, payload) => {
    if (!publicRuntimeConfig.features?.qubit) {
      return;
    }
    window['uv'].emit(type, payload);
  };
  
  export const emitUser = () => {
    if (!publicRuntimeConfig.features?.qubit) {
      return;
    }
  
    const loggedInUser = JSON.parse(sessionStorage.getItem('barca-user'));
  
    if (!(loggedInUser && loggedInUser.email)) {
      return;
    }
  
    const user: User = {
      id: getVisitorId(),
      email: loggedInUser.email,
    };
  
    window['uv'].emit('ecUser', { user });
  };
  
  const roundPrice = (price) => {
    return Math.ceil(price * 100) / 100;
  };
  
  export const emitBasket = (transactionId?: string) => {
    if (!publicRuntimeConfig.features?.qubit) {
      return;
    }
  
    const cartState = cartStore.getState();
    const currency = 'USD';
    const TAX_RATE = 1.05;
  
    const cartId = cartState.cartId;
    const cartQuantity = (cartState.items || []).reduce((prev, cur) => prev + cur.quantity, 0);
    const cartSubTotal = roundPrice(
      (cartState.items || []).reduce(
        (prev, cur) => prev + (cur.detail.ec_promo_price || cur.detail.ec_price) * cur.quantity,
        0
      )
    );
    const cartTotal = roundPrice(cartSubTotal * TAX_RATE);
  
    (cartState.items || []).forEach((item) => {
      const detail = item.detail;
  
      const promoPrice = detail.ec_promo_price || detail.ec_price;
      const subtotal = roundPrice(promoPrice * item.quantity);
      const subtotalIncludingTax = roundPrice(subtotal * TAX_RATE);
  
      const category = detail.ec_category[detail.ec_category.length - 1].split('|');
  
      const basketItem = {
        basket: {
          id: cartId,
          quantity: cartQuantity,
          total: { value: cartTotal, currency },
        },
        product: {
          productId: detail.permanentid,
          name: detail.ec_name,
          url: detail.uri,
          sku: item.sku,
          originalPrice: { value: detail.ec_price, currency, baseValue: detail.ec_price, baseCurrency: currency },
          price: { value: promoPrice, currency, baseValue: promoPrice, baseCurrency: currency },
          stock: item.quantity,
          images: [detail.ec_images[0]],
          category,
          categories: [category.join(' > ')],
          groupId: detail.ec_item_group_id,
        },
        quantity: item.quantity,
        subtotalIncludingTax: { value: subtotalIncludingTax, currency },
        subtotal: {
          value: subtotal,
          currency,
        },
      };
      if (transactionId) {
        basketItem['transaction'] = { id: transactionId };
      }
      emitUV(transactionId ? 'ecBasketItemTransaction' : 'ecBasketItem', basketItem);
    });
  
    const basketSummary = {
      basket: {
        subtotal: { value: cartSubTotal, currency }, // the basket value *before* the application of taxes, discounts, promotions, shipping costs
        subtotalIncludingTax: { value: cartTotal, currency }, //the basket subtotal, including tax, but before the application of discounts, promotions, shipping costs,
        total: { value: cartTotal, currency },
        quantity: cartQuantity,
      },
    };
    if (transactionId) {
      basketSummary['transaction'] = { id: transactionId };
    }
  
    if (cartState.items?.length) {
      emitUV(transactionId ? 'ecBasketTransactionSummary' : 'ecBasketSummary', basketSummary);
    }
  }; */
  
  const CoveoAnalytics = {
    addProductForPurchase,
    addToCart,
    detailView,
    getAnalyticsProductData,
    getOriginsAndCustomData,
    impressions,
    logPageView,
    removeFromCart,
    setActionPurchase,
  };
  
  export default CoveoAnalytics;
  