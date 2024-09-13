import shopifySessionModel from "../Database/session";

export const action = async ({ request }) => {
    try {
        const productIDs = await request.json();
        const productIDObject = productIDs.selectedProductId;
        const sessionObject = await shopifySessionModel.findOne();

        let fetchProductsData = [];

        for (let key in productIDObject) {
            if (productIDObject.hasOwnProperty(key)) {
                const productId = productIDObject[key];

                // Check if the product ID is not null or undefined before making the request
                if (productId) {
                    console.log(`Fetching product ID: ${productId}`);

                    const fetchProducts = await fetch(`https://${sessionObject.shop}/admin/api/2024-01/products/${productId}.json`, {
                        method: "GET",
                        headers: {
                            'X-Shopify-Access-Token': sessionObject.accessToken,
                            'Content-Type': 'application/json'
                        }
                    });

                    const productData = await fetchProducts.json();
                    console.log("productData ======= ", productData);
                    fetchProductsData.push(productData.product);
                } else {
                    console.log(`Skipping null or invalid product ID for key: ${key}`);
                }
            }
        };



        return { fetchProductsData };

    } catch (error) {
        console.log("Error ========== ", error);
        return error;
    }
}
