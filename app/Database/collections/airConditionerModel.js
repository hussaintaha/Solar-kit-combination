import mongoose from "mongoose";

const airConditionerSchema = new mongoose.Schema(
    {
        btuRange: { type: String, required: true },
        products: [{ type: Object, required: true }],
    }
);

const airConditionerCollection = mongoose.models.air_conditioner || mongoose.model("air_conditioner", airConditionerSchema);

export default airConditionerCollection;