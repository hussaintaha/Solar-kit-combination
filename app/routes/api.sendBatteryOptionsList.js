import { json } from "@remix-run/node";
import batteryOptionsCollection from "../Database/collections/batteryOptionsModel";


export const action = async ({ request }) => {
    try {
        const selectedData = await request.json();
        // console.log("selectedData ======== ", selectedData);

        const { selectHarvestValue, selected } = selectedData;

        const updatedEntry = await batteryOptionsCollection.findOneAndUpdate(
            { harvestValue: selectHarvestValue },
            { $set: { products: selected } },
            { new: true, upsert: true }
        );

        // console.log("Entry created or updated successfully:", updatedEntry);
        return json(updatedEntry);

    } catch (error) {
        console.error("Error ========= ", error);
        return json({ error: "An error occurred while processing your request." }, { status: 500 });
    }
};
