import { Result } from '@coveo/headless';

export interface IProduct extends Result {
  objecttype?: string;
  permanentid: string; // sku
  source?: string;
  ec_brand?: string;
  ec_category?: string[];
  ec_description?: string;
  ec_image?: string;
  ec_images?: string[];
  ec_item_group_id?: string;
  ec_name: string;
  ec_price: number;
  ec_promo_price?: number;
  // ec_price_to_report?: number;
  ec_rating?: number;
  ec_reviews?: string[];
  ec_shortdesc?: string;
  sku: string;

  details?: any;
  features?: any;
  cat_slug?: string[];
  childResults?: any[];
  model?: string;
  index?: number;

  ec_fit_size?: string;
}

export function normalizeProduct(props): IProduct {

  let product = props.result || props;
  console.log(product)
  let childResults = [];
  if (product.childResults) {
    childResults = product.childResults;
  }
/*   if (product.raw) {
    product = {
      uri: product.uri,
      ...product.raw,
    };
  } */
   product = {
     ...product,
   permanentid: product.permanentid ,
   ec_category: product.raw.ec_category,
   ec_description:  product.raw.description,
   ec_images: product.raw.ec_images,
   ec_brand: product.raw.ec_brand,
   ec_name: product.raw.ec_name,
   ec_rating: 5,
   ec_price: product.ec_price || 5,
   ec_promo_price: "",
   model: product.raw.ec_item_group_id 
   };

   console.log(product)

  product = {
    // make product extensible.
    ...product,
    childResults,
  };

  // make sure ec_category is an array
  if (product.ec_category && !(product.ec_category instanceof Array)) {
    console.warn('ec_category field is not an array for product: ', product);
    product.ec_category = [product.ec_category];
  }

  return product;
}


export const normalizeForCart = (result, quantity)=>{

    return {
        id : result.raw.permanentid,
        name : result.raw.ec_name,
        category : result.raw.ec_category[result.raw.ec_category.length - 1].replaceAll("|","/"),
        price: result.raw.ec_price || 0,
        currencyCode : 'CAD',
        quantity : quantity
      }
}