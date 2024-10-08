import { json } from "@remix-run/node";
import airConditionerCollection from "../Database/collections/airConditionerModel";

export const action = async ({ request }) => {
    try {
        const selectedData = await request.json()
        // console.log("selectedData ==== ", selectedData);

        const { selectedBTURange, selected } = selectedData
        const existingEntry = await airConditionerCollection.findOne({ btuRange: selectedBTURange });
        // console.log("existingEntry ========= ", existingEntry);


        const updatedAirConditionerEntry = await airConditionerCollection.findOneAndUpdate(
            { btuRange: selectedBTURange },
            { $set: { products: selected } },
            { new: true, upsert: true }
        );
        // console.log("Entry saved/updated successfully:", updatedAirConditionerEntry);

        return json({ existingEntry });

    } catch (error) {
        console.log("error ========= ", error);
        return error
    }
}


