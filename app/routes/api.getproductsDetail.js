import { apiVersion } from "../shopify.server";
import shopifySessionModel from "../Database/session";
export const action = async ({ request }) => {
    try {

        // const {session} = await authenticate.public.appProxy(request);
        const session = await shopifySessionModel.findOne()

        const productId = await request.json();
        // console.log("productId ====== ", productId);

        const variantID = productId.productId

        if (productId) {

            const fetchProducts = await fetch(`https://${session.shop}/admin/api/${apiVersion}/variants/${variantID}.json`, {
                method: "GET",
                headers: {
                    'X-Shopify-Access-Token': session.accessToken,
                    'Content-Type': 'application/json'
                }
            });

            const productData = await fetchProducts.json();
            // console.log("productData ======= ", productData);

            const varientData = productData.variant
            return { varientData }
        } else {
            console.log("Product Id not found");
            return "Product Id not found"
        }

    } catch (error) {
        console.log("error in productdetailAPI ======= ", error);

    }
}

