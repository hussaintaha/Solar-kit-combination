import airConditionerCollection from "../Database/collections/airConditionerModel";
import solarPanelCollection from "../Database/collections/solarPanelModel";
import chargeControllerCollection from "../Database/collections/chargeControllerModel";
import batteryOptionsCollection from "../Database/collections/batteryOptionsModel";

export const action = async ({ request }) => {
    try {
        const requestData = await request.json()
        // console.log("requestData ========== ", requestData);
        const { id, selectedBTURange, selectHarvestValue, productType } = requestData

        if (productType === 'airConditioner') {
            const checkVariantAndDelete = await airConditionerCollection.findOneAndUpdate(
                { btuRange: selectedBTURange },
                { $pull: { products: { id: id } } },
                { new: true }
            );
            // console.log("checkVariantAndDelete ====== ", checkVariantAndDelete);

            if (checkVariantAndDelete) {
                const updatedEntry = await airConditionerCollection.findOne({ btuRange: selectedBTURange });
                // console.log("updatedEntry ========= ", updatedEntry);
                return updatedEntry
            }
        }

        else if (productType === "solarPanel") {
            const checkVariantAndDelete = await solarPanelCollection.findOneAndUpdate(
                { harvestValue: selectHarvestValue },
                { $pull: { products: { id: id } } },
                { new: true }
            );
            // console.log("checkVariantAndDelete ====== ", checkVariantAndDelete);

            if (checkVariantAndDelete) {
                const updatedEntry = await solarPanelCollection.findOne({ harvestValue: selectHarvestValue });
                // console.log("updatedEntry ========= ", updatedEntry);
                return updatedEntry
            }
        }

        else if (productType === "chargeController") {
            const checkVariantAndDelete = await chargeControllerCollection.findOneAndUpdate(
                { harvestValue: selectHarvestValue },
                { $pull: { products: { id: id } } },
                { new: true }
            );
            // console.log("checkVariantAndDelete ====== ", checkVariantAndDelete);

            if (checkVariantAndDelete) {
                const updatedEntry = await chargeControllerCollection.findOne({ harvestValue: selectHarvestValue });
                // console.log("updatedEntry ========= ", updatedEntry);
                return updatedEntry
            }
        }

        else if (productType === "battery") {
            const checkVariantAndDelete = await batteryOptionsCollection.findOneAndUpdate(
                { harvestValue: selectHarvestValue },
                { $pull: { products: { id: id } } },
                { new: true }
            );
            // console.log("checkVariantAndDelete ====== ", checkVariantAndDelete);

            if (checkVariantAndDelete) {
                const updatedEntry = await batteryOptionsCollection.findOne({ harvestValue: selectHarvestValue });
                // console.log("updatedEntry ========= ", updatedEntry);
                return updatedEntry
            }
        }

        return true;
    } catch (error) {
        console.log("error ===== ", error);
        return error
    }
}