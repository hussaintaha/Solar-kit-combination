import { json } from "@remix-run/node";
import airConditionerCollection from "../Database/collections/airConditionerModel";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const selectedData = await request.json();
    // console.log("selectedData ======== ", selectedData);

    const { admin, session } = await authenticate.admin(request);
    console.log("session === ", session);
    uu
    const { selectedBTURange, selected } = selectedData;

    const updatedAirConditionerEntry =
      await airConditionerCollection.findOneAndUpdate(
        { btuRange: selectedBTURange },
        { $addToSet: { products: { $each: selected } } },
        { new: true },
      );
    // console.log(
    //   "Product saved/updated successfully:",
    //   updatedAirConditionerEntry,
    // );

    const fetchproduct = await fetch(
      `https://${session.shop}/admin/api/2024-01/products/${productID}.json`,
      {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": session.accessToken,
        },
      },
    );
    return true;
  } catch (error) {
    console.log("error ========= ", error);
    return error;
  }
};
