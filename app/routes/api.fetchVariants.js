import syncVariantControllerCollection from "../Database/collections/syncvariantsTable";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  try {
    const { session } = await authenticate.admin(request);
    console.log("session:", session);

    if (!session) {
      return { status: false, mesasge: "Session not found" };
    }

    const getVariantList = await syncVariantControllerCollection.find();
    console.log("getVariantList ==== ", getVariantList);

    if (getVariantList.length > 0) {
      return { status: true, data: getVariantList };
    } else {
      return { status: false, message: "Data Not Found" };
    }
    return true;
  } catch (error) {
    console.log("error in fetchVariants API ======= ", error);
    return error;
  }
};
