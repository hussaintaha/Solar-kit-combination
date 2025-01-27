import { apiVersion, authenticate } from "../shopify.server";
import shopifySessionModel from "../Database/session";
import { updateProductVariant } from "./updateProductVariant";

export const action = async ({ request }) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

  if (!admin && topic !== "SHOP_REDACT") {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    // The SHOP_REDACT webhook will be fired up to 48 hours after a shop uninstalls the app.
    // Because of this, no admin context is available.
    throw new Response();
  }

  // The topics handled here should be declared in the shopify.app.toml.
  // More info: https://shopify.dev/docs/apps/build/cli-for-apps/app-configuration
  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        try {
          const deleteSession = await shopifySessionModel.deleteOne({ shop: shop });
          console.log("deleteSession ======= ", deleteSession);
          return deleteSession
        } catch (error) {
          console.log("error ===== ", error);
          return error
        }
      }

    case "ORDERS_FULFILLED": {
      console.log(" ORDERS_FULFILLED payload ======== ", payload);
      const productID = payload.line_items[0].product_id
      console.log("productID ================>>> ", productID);

      try {
        const productResponse = await admin.graphql(`
          query {
            product(id: "gid://shopify/Product/${productID}") {
              tags
            }
          }
        `);

        const productData = await productResponse.json();
        // console.log("productData ============== ", productData);

        const tags = productData.data.product.tags;
        console.log("tags ========= ", tags);

        if (tags.includes("CustomWiringKit")) {
          const response = await admin.graphql(
            `#graphql
            mutation {
              productDelete(input: {id: "gid://shopify/Product/${productID}"}) {
                deletedProductId
                userErrors {
                  field
                  message
                }
              }
            }`,
          );

          const data = await response.json();
          const deleteProductData = data.data
          console.log("deleteProductData ========== ", deleteProductData);
          return ({ message: "Product Delete Successfully" })
        } else {
          return ({ message: "tag not found" })
        }

      } catch (error) {
        console.log("error in delete product ======== ", error);
        return error
      }
    }

    case "PRODUCTS_UPDATE": {
      console.log("PRODUCTS_UPDATE Payload");
      if (payload.variants.length > 0) {
        const response = await updateProductVariant(session, apiVersion, payload.variants);
        console.log("response ==== ", response);

      }
    }


    case "CUSTOMERS_DATA_REQUEST":
    case "CUSTOMERS_REDACT":
    case "SHOP_REDACT":
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
