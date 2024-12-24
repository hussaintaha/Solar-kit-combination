import { apiVersion, authenticate } from "../shopify.server";
import { json } from "@remix-run/node";
import chargeControllerCollection from "../Database/collections/chargeControllerModel";
import { shopifyGraphql } from "./utils";


export const action = async ({ request }) => {
  try {
    const selectedData = await request.json();
    const { session } = await authenticate.admin(request);
    const { selectHarvestValue, selected } = selectedData;

    const updatedProducts = await Promise.all(selected.map(async (product) => {
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
          handle: response.data.product.handle
        };
      }

    }));

    const updatedEntry = await chargeControllerCollection.findOneAndUpdate(
      { harvestValue: selectHarvestValue },
      { $set: { products: updatedProducts } },
      { new: true, upsert: true }
    );
    return json(updatedEntry);

  } catch (error) {
    console.error("Error ========= ", error);
    return json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
};
