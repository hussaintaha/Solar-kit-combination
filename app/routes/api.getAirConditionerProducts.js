import { json } from "@remix-run/node";
import airConditionerCollection from "../Database/collections/airConditionerModel"
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    try {

        await authenticate.admin(request)

        const url = new URL(request.url);
        const searchParams = url.searchParams.get("selectedBTURange");
        // console.log('Extracted searchParams:', searchParams);

        const getVariants = await airConditionerCollection.findOne({
            btuRange: searchParams
        });
        // console.log("getVariants == ", getVariants);
        return json({ getVariants })

    } catch (error) {
        console.log("error ====== ", error);
        return error
    }
}

