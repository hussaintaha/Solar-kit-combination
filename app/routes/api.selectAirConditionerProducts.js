import { authenticate, apiVersion } from "../shopify.server";
import { json } from "@remix-run/node";
import airConditionerCollection from "../Database/collections/airConditionerModel";
import { shopifyGraphql } from "./utils";

export const action = async ({ request }) => {
  try {
    const selectedData = await request.json();
    const { session } = await authenticate.admin(request);
    const { selectedBTURange, selected } = selectedData;

    console.log("dfljhugdikbghikdfbgikdfbgdikbgikdbgdikbg");

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
        console.log("response airconditioner ", response);

        if (response && response.data && response.data.product) {
          return {
            ...product,
            handle: response.data.product.handle,
          };
        }
      }),
    );

    const updatedAirConditionerEntry =
      await airConditionerCollection.findOneAndUpdate(
        { btuRange: selectedBTURange },
        { $set: { products: updatedProducts } },
        { new: true, upsert: true },
      );
    return json({ updatedAirConditionerEntry });
  } catch (error) {
    console.log("error ========= ", error);
    return error;
  }
};
