import mongoose from "mongoose";

const solarPanle = new mongoose.Schema(
    {
        harvestValue: { type: String, required: true },
        products: [{ type: Object, required: true }],
    }
);

const solarPanelCollection = mongoose.models.solar_panel || mongoose.model("solar_panel", solarPanle);

export default solarPanelCollection;