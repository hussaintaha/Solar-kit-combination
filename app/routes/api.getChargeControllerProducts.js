import { json } from "@remix-run/node";
import chargeControllerCollection from "../Database/collections/chargeControllerModel";

export const loader = async ({ request }) => {
    try {
        const url = new URL(request.url);
        const searchParams = url.searchParams.get("selectHarvestValue");
        // console.log('Extracted searchParams:', searchParams);


        const getVariants = await chargeControllerCollection.findOne({
            harvestValue: searchParams
        });
        console.log("getVariants =============== ", getVariants);
        return json({ getVariants })

    } catch (error) {
        console.log("error ====== ", error);
        return error
    }
}
