import { authenticate } from "../shopify.server";


export const action = async ({ request }) => {
    try {

        const { session } = await authenticate.public.appProxy(request);
        console.log("session =======", session);


        const productId = await request.json();
        // console.log("productId ====== ", productId);

        if (productId) {

            const fetchProducts = await fetch(`https://${session.shop}/admin/api/2024-01/products/${productId.productId}.json`, {
                method: "GET",
                headers: {
                    'X-Shopify-Access-Token': session.accessToken,
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
