import airConditionerCollection from "../Database/collections/airConditionerModel";

export const action = async ({ request }) => {
    try {
        const requestData = await request.json()
        console.log("requestData ========== ", requestData);
        const { id, selectedBTURange } = requestData

        const checkVariantAndDelete = await airConditionerCollection.findOneAndUpdate(
            { btuRange: selectedBTURange },
            { $pull: { products: { id: id } } },
            { new: true }
        );
        // console.log("checkVariantAndDelete ====== ", checkVariantAndDelete);

        if (checkVariantAndDelete) {
            const updatedEntry = await airConditionerCollection.findOne({ btuRange: selectedBTURange });
            console.log("updatedEntry ========= ", updatedEntry);
            return updatedEntry
        }


        return true;
    } catch (error) {
        console.log("error ===== ", error);
        return error
    }
}