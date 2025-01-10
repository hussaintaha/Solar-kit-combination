import airConditionerCollection from "../Database/collections/airConditionerModel";
import batteryOptionsCollection from "../Database/collections/batteryOptionsModel";
import chargeControllerCollection from "../Database/collections/chargeControllerModel";
import solarPanelCollection from "../Database/collections/solarPanelModel";
import { shopifyGraphql } from "./utils";

export const updateProductVariant = async (
  session,
  apiVersion,
  variantsData,
) => {
  try {
    console.log("updateProductVariant function");
    console.log("variantsData === ", variantsData);

    for (const variant of variantsData) {
      const collections = [
        { collection: airConditionerCollection, name: "Air Conditioner" },
        { collection: solarPanelCollection, name: "Solar Panel" },
        { collection: chargeControllerCollection, name: "Charge Controller" },
        { collection: batteryOptionsCollection, name: "Battery Options" },
      ];

      for (const { collection, name } of collections) {
        const checkVariantInairConditioner = await collection.find({
          "products.id": variant.admin_graphql_api_id,
        });
        console.log(
          "checkVariantInairConditioner inside loop======= ",
          checkVariantInairConditioner,
        );

        if (checkVariantInairConditioner.length > 0) {
          const query = `
            query {
              productVariant(id: "gid://shopify/ProductVariant/${variant.admin_graphql_api_id.split("/")[4]}") {
                availableForSale
                createdAt
                id
                displayName
                image {
                  id
                  originalSrc
                }
                inventoryItem{
                  __typename
                  id
                }
                inventoryPolicy
                inventoryQuantity
                product{
                  __typename
                  id
                  handle
                }
                selectedOptions{
                  __typename
                  value
                }
                sku
                updatedAt
                title
                price
              }
            }
          `;

          const updateDatainDB = await shopifyGraphql(
            session,
            apiVersion,
            query,
          );

          if (
            updateDatainDB &&
            updateDatainDB.data &&
            updateDatainDB.data.productVariant
          ) {
            const updateProductVariantInDB = await collection.updateMany(
              { "products.id": variant.admin_graphql_api_id },
              {
                $set: {
                  "products.$": updateDatainDB.data.productVariant,
                },
              },
            );

            console.log(
              `${name} updateProductVariantInDB: `,
              updateProductVariantInDB,
            );
          } else {
            console.error(
              `Error fetching product variant data for ${name}:`,
              updateDatainDB,
            );
          }
        }
      }
    }
  } catch (error) {
    console.log("error in updateProductVariant", error);
    return error;
  }
};

// Air Conditioner Collection
// const checkVariantInairConditioner = await airConditionerCollection.find(
//   { 'products.id': variant.admin_graphql_api_id }
// );

// if (checkVariantInairConditioner.length) {
//   //find variants in shopify

//   const sendData = await shopifyGraphql(session, query);
//   // console.log("sendData === ", sendData);

//   if (sendData) {
//     const updateProductVariantInDB = await airConditionerCollection.updateMany(
//       { 'products.id': variant?.admin_graphql_api_id },
//       {
//         '$set': {
//           'products.$': sendData.data.productVariant
//         }
//       }
//     );

//     console.log("updateProductVariantInDB === ", updateProductVariantInDB);
//   }

// }

// // Solar Panel Collection
// const checkVariantInsolarPanel = await solarPanelCollection.find(
//   { 'products.id': variant.admin_graphql_api_id }
// );
// if (checkVariantInsolarPanel.length > 0) {
//   const sendData = await shopifyGraphql(session, query);
//   console.log("sendData === ", sendData);

//   if (sendData) {
//     const updateProductVariantInDB = await solarPanelCollection.updateMany(
//       { 'products.id': variant?.admin_graphql_api_id },
//       {
//         '$set': {
//           'products.$': sendData.data.productVariant
//         }
//       }
//     );

//     console.log("updateProductVariantInDB === ", updateProductVariantInDB);
//   }

// }

// // Charge Controller Collection
// const checkVariantInchargeController = await chargeControllerCollection.find(
//   { 'products.id': variant.admin_graphql_api_id }
// );

// if (checkVariantInchargeController.length > 0) {
//   const sendData = await shopifyGraphql(session, query);
//   console.log("sendData === ", sendData);

//   if (sendData) {
//     const updateProductVariantInDB = await chargeControllerCollection.updateMany(
//       { 'products.id': variant?.admin_graphql_api_id },
//       {
//         '$set': {
//           'products.$': sendData.data.productVariant
//         }
//       }
//     );

//     console.log("updateProductVariantInDB === ", updateProductVariantInDB);
//   }

// }

// // Battery Options Collection
// const checkVariantInbatteryOptions = await batteryOptionsCollection.find(
//   { 'products.id': variant.admin_graphql_api_id }
// );
// console.log("checkVariantInbatteryOptions === ", checkVariantInbatteryOptions);
// if (checkVariantInbatteryOptions.length > 0) {

//   const sendData = await shopifyGraphql(session, query);
//   console.log("sendData === ", sendData);

//   if (sendData) {
//     const updateProductVariantInDB = await batteryOptionsCollection.updateMany(
//       { 'products.id': variant?.admin_graphql_api_id },
//       {
//         '$set': {
//           'products.$': sendData.data.productVariant
//         }
//       }
//     );

//     console.log("updateProductVariantInDB === ", updateProductVariantInDB);
//   }

// }
