import { json } from "@remix-run/node";
import batteryOptionsCollection from "../Database/collections/batteryOptionsModel";

export const loader = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams.get("selectHarvestValue");
        // console.log('Extracted searchParams:', searchParams);


        const getVariants = await batteryOptionsCollection.findOne({
            harvestValue: searchParams
        });
        // console.log("getVariants == ", getVariants);
        return json({ getVariants })

    } catch (error) {
        console.log("error ====== ", error);
        return error
    }
}