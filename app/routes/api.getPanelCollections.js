// import { authenticate } from "../shopify.server";
import solarPanelCollection from "../Database/collections/solarPanelModel";

export const loader = async ({ request }) => {
    try {

        // const { session, admin } = await authenticate.public.appProxy(request);
        // console.log("session =======", session);

        const urlString = request.url
        // console.log("urlString ======= ", urlString);
        const url = new URL(urlString);
        const params = new URLSearchParams(url.search);

        let neededHarvestkWh = parseFloat(params.get('neededHarvestkWh'));
        // console.log("neededHarvestkWh =========== ", Number(neededHarvestkWh).toFixed(2));

        let variantId = [];

        if (!neededHarvestkWh) {
            return "Select Harvest Value"
        }

        let harvestValue;
        if (neededHarvestkWh < 4) {
            harvestValue = "lessThan4kWh";
        } else if (neededHarvestkWh >= 4 && neededHarvestkWh < 10) {
            harvestValue = "4to10kWh";
        } else if (neededHarvestkWh >= 10 && neededHarvestkWh < 20) {
            harvestValue = "10to20kWh";
        } else if (neededHarvestkWh >= 20) {
            harvestValue = "greaterThan20kWh";
        }


        // console.log(`Determined harvest Range: ${harvestValue}`)

        const productsInRange = await solarPanelCollection.find({ harvestValue: harvestValue });
        if (productsInRange.length > 0) {
            console.log("productsInRange 1111 ======= ", productsInRange);
            return { products: productsInRange[0].products };
        } else {
            console.log(`No products found for harvest value 111 : ${harvestValue}`);
            return { products: [] };
        }
    } catch (error) {
        console.log("error in solarPannel API ==========", error);
        return error
    }
}