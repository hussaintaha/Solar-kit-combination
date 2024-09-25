import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
    try {

        const { session } = await authenticate.public.appProxy(request);
        console.log("session =======", session);

        const requestObject = await request.json();
        console.log("requestObject ========== ", requestObject);

        const productIDObject = requestObject.selectedProductId;
        console.log("productIDObject ====== ", productIDObject);

   
        let varientIdArray = [];

        const fetchPromises = Object.values(productIDObject).map(async (productId) => {
            if (productId) {
                console.log(`Fetching product ID: ${productId}`);

                const response = await fetch(`https://${session.shop}/admin/api/2024-01/products/${productId}.json`, {
                    method: "GET",
                    headers: {
                        'X-Shopify-Access-Token': session.accessToken,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch product ${productId}: ${response.statusText}`);
                }

                const productData = await response.json();
                const varientIds = productData.product.variants[0].id
                varientIdArray.push(varientIds)

                return productData.product;
            }
        });

        const fetchProductsData = (await Promise.all(fetchPromises)).filter(product => product);
        // console.log("fetchProductsData ======= ", fetchProductsData);

        return { success: true, varientIdArray: varientIdArray };
    } catch (error) {
        console.error("Error ========== ", error);
        return { success: false, message: error.message };
    }
};







// const fetchProducts = await fetch(`https://${sessionObject.shop}/admin/api/2024-01/products/8610287354068.json`, {
//     method: "GET",
//     headers: {
//         'X-Shopify-Access-Token': sessionObject.accessToken,
//         'Content-Type': 'application/json'
//     }
// });

// const productData = await fetchProducts.json();
// console.log("productData ======= ", productData.product.variants);


// // console.log("fetchProductsData ========= ", fetchProductsData[0].variants);
// return { fetchProductsData };


























// for (let key in productIDObject) {
//     if (productIDObject.hasOwnProperty(key)) {
//         const productId = productIDObject[key];

//         // Check if the product ID is not null or undefined before making the request
//         // if (productId) {
//         console.log(`Fetching product ID: ${productId}`);

//         const fetchProducts = await fetch(`https://${sessionObject.shop}/admin/api/2024-01/products/8627502514388.json`, {
//             method: "GET",
//             headers: {
//                 'X-Shopify-Access-Token': sessionObject.accessToken,
//                 'Content-Type': 'application/json'
//             }
//         });

//         const productData = await fetchProducts.json();
//         console.log("productData ======= ", productData);


//         fetchProductsData.push(productData.product);
//         // } else {
//         //     console.log(`Skipping null or invalid product ID for key: ${key}`);
//         // }
//     }
// };