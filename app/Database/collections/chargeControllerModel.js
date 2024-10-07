import mongoose from "mongoose";

const chargeController = new mongoose.Schema(
    {
        harvestValue: { type: String, required: true },
        products: [{ type: Object, required: true }],
    }
);

const chargeControllerCollection = mongoose.models.charge_controller || mongoose.model("charge_controller", chargeController);

export default chargeControllerCollection;