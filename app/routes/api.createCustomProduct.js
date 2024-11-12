import { authenticate, apiVersion } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { session } = await authenticate.public.appProxy(request);

    const requestData = await request.json()

    const { batterytoHVAC, paneltoBattery } = requestData

    let title;
    let customProductPrice = 0;

    if (paneltoBattery && batterytoHVAC) {
      title = `${paneltoBattery} Feet from Panels to Battery / ${batterytoHVAC} Feet from Battery to HVAC`;
      customProductPrice = (paneltoBattery * 4) + (batterytoHVAC * 6) + 33;
    } else if (paneltoBattery) {
      title = `${paneltoBattery} Feet from Panels to Battery`;
      customProductPrice = paneltoBattery * 4;
    } else if (batterytoHVAC) {
      title = `${batterytoHVAC} Feet from Battery to HVAC`;
      customProductPrice = batterytoHVAC * 6 + 33;
    }

    const productData = {
      product: {
        title: `Custom Cable Kit: ${title}`,
        product_type: "Product",
        tags: ["CustomWiringKit"],
        images: [
          {
            src: "https://app.fullbattery.com/custom-product/custom-product.png"
          }
        ],
        variants: [
          {
            price: customProductPrice,
            sku: "CWK-Small",
          }
        ],
        metafields: [
          {
            namespace: "seo",
            key: "hidden",
            type: "number_integer",
            value: "1"
          },
          {
            namespace: "custom Wiring Kit"
          }
        ],
      }
    };

    const createProducts = await fetch(`https://${session.shop}/admin/api/${apiVersion}/products.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": session.accessToken
      },
      body: JSON.stringify(productData)
    });

    const createdProductResponse = await createProducts.json()
    // console.log("createdProductResponse ======= ", createdProductResponse);

    const getVarientID = createdProductResponse.product.variants[0].id
    // console.log("getVarientID =============== ", getVarientID);

    return getVarientID
  } catch (error) {
    console.log("error ============ ", error);
    return error
  }
}