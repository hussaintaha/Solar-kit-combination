import airConditionerCollection from "../Database/collections/airConditionerModel";
import { authenticate, apiVersion } from "../shopify.server";
import { shopifyGraphql } from "./utils";

export const action = async ({ request }) => {
  try {
    console.log("apiVersion =================== ", apiVersion);

    const selectedData = await request.json();
    const { session } = await authenticate.admin(request);
    const { selectedBTURange, selected } = selectedData;

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
        { $addToSet: { products: { $each: updatedProducts } } },
        { new: true },
      );
    return true;
  } catch (error) {
    console.log("error ========= ", error);
    return error;
  }
};
