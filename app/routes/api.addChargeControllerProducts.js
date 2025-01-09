import { json } from "@remix-run/node";
import chargeControllerCollection from "../Database/collections/chargeControllerModel";
import { authenticate, apiVersion } from "../shopify.server";
import { shopifyGraphql } from "./utils";

export const action = async ({ request }) => {
  try {
    const selectedData = await request.json();
    const { session } = await authenticate.admin(request);
    const { selectHarvestValue, selected } = selectedData;

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
        console.log("response 2222 === ", response);

        if (response && response.data && response.data.product) {
          return {
            ...product,
            handle: response.data.product.handle,
          };
        }
      }),
    );

    const updatedAirConditionerEntry =
      await chargeControllerCollection.findOneAndUpdate(
        { harvestValue: selectHarvestValue },
        { $addToSet: { products: { $each: updatedProducts } } }, // Change to $push if needed
        { new: true },
      );

    if (!updatedAirConditionerEntry) {
      console.log(
        "No matching entry found for harvestValue:",
        selectHarvestValue,
      );
      return json({ success: false, message: "No matching entry found." });
    }

    const updatedEntry = await chargeControllerCollection.findOne({
      harvestValue: selectHarvestValue,
    });
    return json({ success: true, updatedEntry });
  } catch (error) {
    console.log("error ========= ", error);
    return json({ success: false, message: error.message });
  }
};
