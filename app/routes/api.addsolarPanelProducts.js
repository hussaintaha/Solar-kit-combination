import { json } from "@remix-run/node";
import solarPanelCollection from "../Database/collections/solarPanelModel";
import { authenticate, apiVersion } from "../shopify.server";

export const action = async ({ request }) => {
    try {
        const selectedData = await request.json();
        const { session } = await authenticate.admin(request);
        const { selectHarvestValue, selected } = selectedData;

        const updatedProducts = await Promise.all(selected.map(async (product) => {
            const splitProductId = product.product.id.split("/")[4];
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

        const updatedAirConditionerEntry = await solarPanelCollection.findOneAndUpdate(
            { harvestValue: selectHarvestValue },
            { $addToSet: { products: { $each: updatedProducts } } }, // Change to $push if needed
            { new: true }
        );
        // console.log("updatedAirConditionerEntry ====== ", updatedAirConditionerEntry);

        if (!updatedAirConditionerEntry) {
            console.log("No matching entry found for harvestValue:", selectHarvestValue);
            return json({ success: false, message: "No matching entry found." });
        }

        const updatedEntry = await solarPanelCollection.findOne({ harvestValue: selectHarvestValue });
        // console.log("Updated Entry after operation:", updatedEntry);
        return json({ success: true, updatedEntry });

    } catch (error) {
        console.log("error ========= ", error);
        return json({ success: false, message: error.message });
    }
};
