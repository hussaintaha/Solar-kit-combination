import { json } from "@remix-run/node";
import batteryOptionsCollection from "../Database/collections/batteryOptionsModel";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    try {
        await authenticate.admin(request);

        const url = new URL(request.url);
        const searchParams = url.searchParams.get("selectHarvestValue");


        const getVariants = await batteryOptionsCollection.findOne({
            harvestValue: searchParams
        });
        // console.log("getVariants == ", getVariants);
        return json({ getVariants })

    } catch (error) {
        console.log("error in batteryOptions ====== ", error);
        return error
    }
}