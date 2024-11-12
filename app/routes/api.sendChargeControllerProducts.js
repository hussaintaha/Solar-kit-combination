import { apiVersion, authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import chargeControllerCollection from "../Database/collections/chargeControllerModel";


export const action = async ({ request }) => {
    try {
        const selectedData = await request.json();
        const { session } = await authenticate.admin(request);
        const { selectHarvestValue, selected } = selectedData;

        const updatedProducts = await Promise.all(selected.map(async (product) => {
            const splitProductId = product.product.id.split("/")[4];
            // console.log("splitProductId === ", splitProductId);
            const response = await fetch(`https://${session.shop}/admin/api/${apiVersion}/products/${splitProductId}.json`, {
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
        // console.log("updatedProducts ====== ", updatedProducts);

        const updatedEntry = await chargeControllerCollection.findOneAndUpdate(
            { harvestValue: selectHarvestValue },
            { $set: { products: updatedProducts } },
            { new: true, upsert: true }
        );

        // console.log("Entry created or updated successfully:", updatedEntry);
        return json(updatedEntry);

    } catch (error) {
        console.error("Error ========= ", error);
        return json({ error: "An error occurred while processing your request." }, { status: 500 });
    }
};
