import mongoose from "mongoose";

const syncVariantController = new mongoose.Schema({
  variants: [{ type: Object, required: true }],
  code: { type: String, required: true },
});

const syncVariantControllerCollection =
  mongoose.models.sync_variants ||
  mongoose.model("sync_variants", syncVariantController);

export default syncVariantControllerCollection;
