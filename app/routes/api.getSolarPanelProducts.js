import { json } from "@remix-run/node";
import solarPanelCollection from "../Database/collections/solarPanelModel";

export const loader = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams.get("selectHarvestValue");
        // console.log('Extracted searchParams:', searchParams);


        const getVariants = await solarPanelCollection.findOne({
            harvestValue: searchParams
        });
        // console.log("getVariants == ", getVariants);
        return json({ getVariants })

    } catch (error) {
        console.log("error ====== ", error);
        return error
    }
}