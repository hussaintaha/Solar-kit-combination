import { json } from "@remix-run/node";
import batteryOptionsCollection from "../Database/collections/batteryOptionsModel";

export const action = async ({ request }) => {
    try {
        const selectedData = await request.json();
        console.log("selectedData ======== ", selectedData);

        const { selectHarvestValue, selected } = selectedData;
        console.log("selectHarvestValue ======== ", selectHarvestValue);
        console.log("selected ======== ", selected);

        const existingEntry = await batteryOptionsCollection.findOne({ harvestValue: selectHarvestValue });
        console.log("existingEntry products before update ======== ", existingEntry.products);

        const updatedAirConditionerEntry = await batteryOptionsCollection.findOneAndUpdate(
            { harvestValue: selectHarvestValue },
            { $addToSet: { products: { $each: selected } } }, // Change to $push if needed
            { new: true }
        );

        if (!updatedAirConditionerEntry) {
            console.log("No matching entry found for harvestValue:", selectHarvestValue);
            return json({ success: false, message: "No matching entry found." });
        }

        const updatedEntry = await batteryOptionsCollection.findOne({ harvestValue: selectHarvestValue });
        console.log("Updated Entry after operation:", updatedEntry);
        return json({ success: true, updatedEntry });

    } catch (error) {
        console.log("error ========= ", error);
        return json({ success: false, message: error.message });
    }
};
