import mongoose from "mongoose";

const BatteryOptions = new mongoose.Schema(
    {
        harvestValue: { type: String, required: true },
        products: [{ type: Object, required: true }],
    }
);

const batteryOptionsCollection = mongoose.models.battery_options || mongoose.model("battery_options", BatteryOptions);

export default batteryOptionsCollection;