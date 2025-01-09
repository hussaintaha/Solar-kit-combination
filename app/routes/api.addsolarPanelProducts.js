import { json } from "@remix-run/node";
import solarPanelCollection from "../Database/collections/solarPanelModel";
import { authenticate, apiVersion } from "../shopify.server";
import { shopifyGraphql } from "./utils";

export const action = async ({ request }) => {
  try {
    const selectedData = await request.json();
    const { session } = await authenticate.admin(request);
    const { selectHarvestValue, selected } = selectedData;

    console.log("selectHarvestValue ====== ", selectHarvestValue);

    const updatedProducts = await Promise.all(
      selected.map(async (product) => {
        const splitProductId = product.product.id.split("/")[4];

        const query = `
        query GetProduct {
          product(id: "gid://shopify/Product/${splitProductId}") {
            id
            handle
          }
        }
      `;

        const response = await shopifyGraphql(session, apiVersion, query);
        console.log("response ======= ", response);

        if (response && response.data && response.data.product) {
          return {
            ...product,
            handle: response.data.product.handle,
          };
        }
      }),
    );

    const updatedAirConditionerEntry =
      await solarPanelCollection.findOneAndUpdate(
        { harvestValue: selectHarvestValue },
        { $addToSet: { products: { $each: updatedProducts } } },
        { new: true },
      );

    console.log(
      "updatedAirConditionerEntry ===== ",
      updatedAirConditionerEntry,
    );

    if (!updatedAirConditionerEntry) {
      console.log(
        "No matching entry found for harvestValue:",
        selectHarvestValue,
      );
      return json({ success: false, message: "No matching entry found." });
    }

    const updatedEntry = await solarPanelCollection.findOne({
      harvestValue: selectHarvestValue,
    });
    return json({ success: true, updatedEntry });
  } catch (error) {
    console.log("error ========= ", error);
    return json({ success: false, message: error.message });
  }
};
