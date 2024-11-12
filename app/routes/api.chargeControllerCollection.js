import { authenticate } from "../shopify.server";
import chargeControllerCollection from "../Database/collections/chargeControllerModel";

export const loader = async ({ request }) => {
    try {

        await authenticate.public.appProxy(request);
        const urlString = request.url
        const url = new URL(urlString);
        const params = new URLSearchParams(url.search);

        // Get the value of 'neededHarvestkWh' from the URL query string
        const neededHarvestkWh = params.get('neededHarvestkWh');
        // console.log("neededHarvestkWh ======== ", neededHarvestkWh);

        let harvestValue;

        if (!neededHarvestkWh) {
            return "Select Harvest Value"
        }

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

        const productsInRange = await chargeControllerCollection.find({ harvestValue: harvestValue });
        if (productsInRange.length) {
            // console.log("ChargeController_productsInRange ======= ", productsInRange);
            return { products: productsInRange[0].products };
        } else {
            console.log(`No products found for ChargeController: ${harvestValue}`);
            return { products: [] };
        }
    } catch (error) {
        console.log("error in solarPannel API ==========", error);
        return error

    }
}