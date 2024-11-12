import { authenticate } from "../shopify.server";
import airConditionerCollection from "../Database/collections/airConditionerModel";
import solarPanelCollection from "../Database/collections/solarPanelModel";
import chargeControllerCollection from "../Database/collections/chargeControllerModel";
import batteryOptionsCollection from "../Database/collections/batteryOptionsModel";

export const action = async ({ request }) => {
    try {
        await authenticate.admin(request);
        
        const requestData = await request.json()
        const { id, selectedBTURange, selectHarvestValue, productType } = requestData

        if (productType === 'airConditioner') {
            const checkVariantAndDelete = await airConditionerCollection.findOneAndUpdate(
                { btuRange: selectedBTURange },
                { $pull: { products: { id: id } } },
                { new: true }
            );

            if (checkVariantAndDelete) {
                const updatedEntry = await airConditionerCollection.findOne({ btuRange: selectedBTURange });
                return updatedEntry
            }
        }

        else if (productType === "solarPanel") {
            const checkVariantAndDelete = await solarPanelCollection.findOneAndUpdate(
                { harvestValue: selectHarvestValue },
                { $pull: { products: { id: id } } },
                { new: true }
            );

            if (checkVariantAndDelete) {
                const updatedEntry = await solarPanelCollection.findOne({ harvestValue: selectHarvestValue });
                return updatedEntry
            }
        }

        else if (productType === "chargeController") {
            const checkVariantAndDelete = await chargeControllerCollection.findOneAndUpdate(
                { harvestValue: selectHarvestValue },
                { $pull: { products: { id: id } } },
                { new: true }
            );

            if (checkVariantAndDelete) {
                const updatedEntry = await chargeControllerCollection.findOne({ harvestValue: selectHarvestValue });
                return updatedEntry
            }
        }

        else if (productType === "battery") {
            const checkVariantAndDelete = await batteryOptionsCollection.findOneAndUpdate(
                { harvestValue: selectHarvestValue },
                { $pull: { products: { id: id } } },
                { new: true }
            );

            if (checkVariantAndDelete) {
                const updatedEntry = await batteryOptionsCollection.findOne({ harvestValue: selectHarvestValue });
                return updatedEntry
            }
        }

        return true;
    } catch (error) {
        console.log("error ===== ", error);
        return error
    }
}