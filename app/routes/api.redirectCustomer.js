import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
    try {
        const { admin, session } = await authenticate.public.appProxy(request);

        const requestData = await request.json();

        const { variantdata } = requestData;

        const variantID = (variantdata.id).split("/")[4];

        const productID = (variantdata.product.id).split("/")[4]

        const fetchproduct = await fetch(`https://${session.shop}/admin/api/2024-01/products/${productID}.json`, {
            method: "GET",
            headers: {
                "X-Shopify-Access-Token": session.accessToken
            }
        });
        const productData = await fetchproduct.json();
        const redirectURL = `https://${session.shop}/products/${productData?.product?.handle}?variant=${variantID}`
        return redirectURL;

    } catch (error) {
        console.log("error === ", error);
        return error;
    }
}
