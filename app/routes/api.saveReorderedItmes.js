import airConditionerCollection from "../Database/collections/airConditionerModel";
import solarPanelCollection from "../Database/collections/solarPanelModel";
import chargeControllerCollection from "../Database/collections/chargeControllerModel";
import batteryOptionsCollection from "../Database/collections/batteryOptionsModel";

export const action = async ({ request }) => {
    try {
        const requestData = await request.json();
        const { data, range, collection } = requestData;

        if (collection === "airConditionerproducts") {
            const updatedAirConditionerEntry = await airConditionerCollection.findOneAndUpdate(
                { btuRange: range },
                { $set: { products: data } },
                { new: true, upsert: true }
            );

            console.log("updatedAirConditionerEntry ====== ", updatedAirConditionerEntry);
        }
        else if (collection === "solarPanelProducts") {
            const updatedSolarPanelEntry = await solarPanelCollection.findOneAndUpdate(
                { harvestValue: range },
                { $set: { products: data } },
                { new: true, upsert: true }
            );
            console.log("updatedSolarPanelEntry ====== ", updatedSolarPanelEntry);
        }
        else if (collection === "chargeControllerProducts") {
            const updatedchargeControllerEntry = await chargeControllerCollection.findOneAndUpdate(
                { harvestValue: range },
                { $set: { products: data } },
                { new: true, upsert: true }
            );
            console.log("updatedchargeControllerEntry ====== ", updatedchargeControllerEntry);
        }
        else if (collection === "selectBatteryOptions") {
            const updatedselectBatteryEntry = await batteryOptionsCollection.findOneAndUpdate(
                { harvestValue: range },
                { $set: { products: data } },
                { new: true, upsert: true }
            );
            console.log("updatedselectBatteryEntry ====== ", updatedselectBatteryEntry);
        }
        return true;
    } catch (error) {
        console.log("error in reOrderItmesAPI =====", error);
        return error;
    }
}
