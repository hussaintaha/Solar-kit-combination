import shopifySessionModel from "../Database/session";

export const action = async ({ request }) => {
    try {

        const productId = await request.json();
        // console.log("productId ====== ", productId);

        const sessionObject = await shopifySessionModel.findOne();

        if (productId) {

            const fetchProducts = await fetch(`https://${sessionObject.shop}/admin/api/2024-01/products/${productId.productId}.json`, {
                method: "GET",
                headers: {
                    'X-Shopify-Access-Token': sessionObject.accessToken,
                    'Content-Type': 'application/json'
                }
            });

            const productData = await fetchProducts.json();
            // console.log("productData ======= ", productData);

            return { productData }
        } else {
            console.log("Product Id not found");
            return "Product Id not found"
        }

    } catch (error) {
        console.log("error in productdetailAPI ======= ", error);

    }
}