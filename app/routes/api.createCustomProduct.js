import shopifySessionModel from "../Database/session";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
    const { admin, session } = await authenticate.public.appProxy(request);
    console.log("admin11111 ============", admin.rest.resources.Product);
    console.log("session ========== ", session);

    const createProducts = await admin.graphql(
        `#graphql
        mutation CreateProductWithOptions($input: ProductInput!) {
    productCreate(input: $input) {
    userErrors {
      field
      message
    }
    product {
      id
      options {
        id
        name
        position
        values
        optionValues {
          id
          name
          hasVariants
        }
      }
      variants(first: 5) {
        nodes {
          id
          title
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
}`, {
        variables: {
            "input": {
                "title": "New product",
                "productOptions": [
                    {
                        "name": "Color",
                        "values": [
                            {
                                "name": "Red"
                            }
                        ]
                    }
                ]
            }
        }
    }
    );
    console.log("createProducts =========== ", createProducts);


    return "varientID"
}






// try {
//     const getdistance = await request.json();
//     // console.log("getdistance ==== ", getdistance);

//     const { batterytoHVAC, paneltoBattery } = getdistance;
//     // Calculate price
//     const price = (batterytoHVAC * 4 + paneltoBattery * 6 + 33);
//     // console.log("price =========== ", price);

//     // Fetch session data
//     const sessionObject = await shopifySessionModel.findOne();
//     const shopUrl = `https://${sessionObject.shop}/admin/api/2024-07/graphql.json`;

//     // Create draft product
//     const draftProductCreateResponse = await fetch(shopUrl, {
//         method: "POST",
//         headers: {
//             'X-Shopify-Access-Token': sessionObject.accessToken,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             query: `
//                 mutation CreateProductWithOptions($input: ProductInput!) {
//                     productCreate(input: $input) {
//                         userErrors {
//                             field
//                             message
//                         }
//                         product {
//                             id
//                             options {
//                                 id
//                                 name
//                                 position
//                                 values
//                                 optionValues {
//                                     id
//                                     name
//                                     hasVariants
//                                 }
//                             }
//                             variants(first: 5) {
//                                 nodes {
//                                     id
//                                     title
//                                     selectedOptions {
//                                         name
//                                         value
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }`,
//             variables: {
//                 "input": {
//                     "title": "New product",
//                     "productOptions": [
//                         {
//                             "name": "Color",
//                             "values": [
//                                 {
//                                     "name": "Red"
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             }
//         })
//     });

//     const draftProductData = await draftProductCreateResponse.json();
//     console.log("productCreateResponse ======== ", draftProductData);


//     const productCreateErrors = draftProductData.data.productCreate.userErrors;

//     if (productCreateErrors.length > 0) {
//         console.log("Error creating product:", productCreateErrors);
//         return "Error in product creation process";
//     }
//     const productData = draftProductData.data.productCreate.product;
//     console.log("productData =========== ", productData);

//     const productvarient = draftProductData.data.productCreate.product.variants.nodes[0]
//     console.log("productvarient ========= ", productvarient);

//     // ================================================= Create Variant API ================================================= //
//     const variantUpdateAPI = await fetch(shopUrl, {
//         method: "POST",
//         headers: {
//             'X-Shopify-Access-Token': sessionObject.accessToken,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             query: `
//                 mutation UpdateProductVariantsOptionValuesInBulk($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
//                     productVariantsBulkUpdate(productId: $productId, variants: $variants) {
//                         product {
//                             id
//                             title
//                             options {
//                                 id
//                                 position
//                                 name
//                                 values
//                                 optionValues {
//                                     id
//                                     name
//                                     hasVariants
//                                 }
//                             }
//                         }
//                         productVariants {
//                             id
//                             title
//                             price
//                             selectedOptions {
//                                 name
//                                 value
//                             }
//                         }
//                         userErrors {
//                             field
//                             message
//                         }
//                     }
//                 }`,
//             variables: {
//                 productId: productData.id,
//                 variants: [
//                     {
//                         id: productvarient.id,
//                         optionValues: [
//                             {
//                                 name: "Orange",
//                                 optionName: "Color"
//                             }
//                         ],
//                         price: 40.00
//                     }
//                 ]
//             }
//         })
//     });


//     const varientUpdateResponse = await variantUpdateAPI.json()

//     const updateProduct = varientUpdateResponse.data.productVariantsBulkUpdate.product
//     const updateProductVArient = varientUpdateResponse.data.productVariantsBulkUpdate.productVariants

//     console.log("updateProduct ========= ", updateProduct);
//     console.log("updateProductVArient ========= ", updateProductVArient);


//     return {updateProductVArient};

// } catch (error) {
//     console.error("Error in custom product API ====== ", error);
//     return "An error occurred";
// }











// ======================= Create variant ======================= //
// const createVariantAPIResponse = await fetch(shopUrl, {
//     method: "POST",
//     headers: {
//         'X-Shopify-Access-Token': sessionObject.accessToken,
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         query: `mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
//       productVariantsBulkCreate(productId: $productId, variants: $variants) {
//         userErrors {
//           field
//           message
//         }
//         product {
//           id
//           options {
//             id
//             name
//             values
//             position
//             optionValues {
//               id
//               name
//               hasVariants
//             }
//           }
//         }
//         productVariants {
//           id
//           title
//           selectedOptions {
//             name
//             value
//           }
//         }
//       }
//     }`,
//         "variables": {
//             "productId": productData.id,
//             "variants": [
//                 {
//                     "optionValues": [
//                         {
//                             "name": "Red",
//                             "optionName": "Color"
//                         },
//                     ],
//                     "price": 22.0
//                 },
//             ]
//         },
//     })
// });

// const variantResponseData = await createVariantAPIResponse.json();
// console.log("varientResponse ================== ", variantResponseData);


// const variantId = variantResponseData.data.productVariantCreate.productVariant.id;
// const inventoryItemId = variantResponseData.data.productVariantCreate.productVariant.inventoryItem.id;








// const createVariantAPIResponse = await fetch(shopUrl, {
//     method: "POST",
//     headers: {
//         'X-Shopify-Access-Token': sessionObject.accessToken,
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         query: `
//             mutation productVariantCreate($input: ProductVariantInput!) {
//                 productVariantCreate(input: $input) {
//                     product {
//                         id
//                         title
//                     }
//                     productVariant {
//                         id
//                         createdAt
//                         displayName
//                         inventoryItem {
//                             unitCost {
//                                 amount
//                                 currencyCode
//                             }
//                             tracked
//                         }
//                         inventoryPolicy
//                         inventoryQuantity
//                         price
//                         product {
//                             id
//                         }
//                         title
//                     }
//                     userErrors {
//                         field
//                         message
//                     }
//                 }
//             }
//         `,
//         variables: {
//             "input": {
//                 "productId": productData.id,
//                 "price": "114.99",
//                 "inventoryPolicy": "DENY",
//                 "requiresShipping": true,
//                 "options": ["Holographic"],
//                 "inventoryItem": {
//                     "cost": "50.00",
//                     "tracked": true
//                 }
//             }
//         }
//     })
// });


// const variantCreateData = await createVariantAPIResponse.json();
// console.log("result ================ ", variantCreateData);

// const variantCreateErrors = variantCreateData.data.productVariantCreate.userErrors;
// if (variantCreateErrors.length > 0) {
//     console.log("Error creating variant:", variantCreateErrors);
//     return "Error in variant creation process";
// }

// const variantCreateproduct = variantCreateData.data.productVariantCreate.product;
// const customproductVariant = variantCreateData.data.productVariantCreate.productVariant;

// console.log("variantCreateproduct ================ ", variantCreateproduct);
// console.log("customproductVariant ================ ", customproductVariant);



// const createVarient = await fetch(`https://${sessionObject.shop}/admin/api/2024-07/products/${product_id}/variants.json`, {
// method: "POST",
// headers: {
// "Content-Type": "application/json",
// "X-Shopify-Access-Token": sessionObject.accessToken
// },
// body: JSON.stringify({
// "varient": {
// "product_id": product_id,
// "option1": "Custom Wiring kit 111111111111111 ",
// "price": 50.00,
// }
// })
// });
// 
// console.log("createVarient =============== ", await createVarient.json());