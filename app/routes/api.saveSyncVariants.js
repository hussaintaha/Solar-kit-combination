import syncVariantControllerCollection from "../Database/collections/syncvariantsTable";

export const action = async ({ request }) => {
  try {
    const body = await request.json();
    // console.log("body === ", body)

    const { item, code } = body;
    console.log("item == ", item);
    console.log("code == ", code);

    if (!item && !code) {
      return { status: false, message: "Something wen wrong" };
    }

    const saveVariantsInDB =
      await syncVariantControllerCollection.findOneAndUpdate(
        { "variants.id": item.id },
        {
          $set: { code: code, variants: item },
        },
        { upsert: true, new: true },
      );

    console.log("saveVariantsInDB === ", saveVariantsInDB);

    if (saveVariantsInDB) {
      return { status: true, data: saveVariantsInDB };
    }
  } catch (error) {
    console.log("error in saveSyncVariants", error);
    return error;
  }
};
