import { authenticate } from "../shopify.server";
// /home/vowelweb/solar-combo-app/solar-combination/app/routes/api.getproductsDetail.js

export const action = async ({ request }) => {
    try {

        const { session } = await authenticate.public.appProxy(request);
        // console.log("session =======", session);

        const productId = await request.json();
        console.log("productId ====== ", productId);

        const variantID = productId.productId

        if (productId) {

            const fetchProducts = await fetch(`https://${session.shop}/admin/api/2024-07/variants/${variantID}.json`, {
                method: "GET",
                headers: {
                    'X-Shopify-Access-Token': session.accessToken,
                    'Content-Type': 'application/json'
                }
            });

            const productData = await fetchProducts.json();
            console.log("productData ======= ", productData);

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
