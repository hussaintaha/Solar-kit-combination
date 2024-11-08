import airConditionerCollection from "../Database/collections/airConditionerModel";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
    try {
        const selectedData = await request.json();

        const { session } = await authenticate.admin(request);
        console.log("session === ", session);

        const { selectedBTURange, selected } = selectedData;

        const updatedProducts = await Promise.all(selected.map(async (product) => {
            const splitProductId = product.product.id.split("/")[4];
            const response = await fetch(`https://${session.shop}/admin/api/2024-10/products/${splitProductId}.json`, {
                method: "GET",
                headers: {
                    "X-Shopify-Access-Token": session.accessToken
                }
            });
            const productData = await response.json();
            // console.log("productData ==== ", productData.product.handle);
            return {
                ...product,
                handle: productData.product.handle
            };
        }));

        const updatedAirConditionerEntry =
            await airConditionerCollection.findOneAndUpdate(
                { btuRange: selectedBTURange },
                { $addToSet: { products: { $each: updatedProducts } } },
                { new: true },
            );
        return true;
    } catch (error) {
        console.log("error ========= ", error);
        return error;
    }
};
