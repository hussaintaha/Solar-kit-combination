import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import solarPanelCollection from "../Database/collections/solarPanelModel";

export const loader = async ({ request }) => {
    try {
        await authenticate.admin(request);
        const url = new URL(request.url);
        const searchParams = url.searchParams.get("selectHarvestValue");
        const getVariants = await solarPanelCollection.findOne({
            harvestValue: searchParams
        });
        // console.log("getVariants == ", getVariants);
        return json({ getVariants })
    } catch (error) {
        console.log("error in solarPanel ====== ", error);
        return error
    }
}