import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { session } = await authenticate.public.appProxy(request);

    const requestData = await request.json()
    // console.log("requestData ========== ", requestData);

    const { batterytoHVAC, paneltoBattery } = requestData

    //calculate Product price
    //Distance from Panels to Battery ___ ft ($a)
    //Distance from Battery to HVAC ___ ft ($b)
    //Price = $a*4+$b*6+33 

    const customProductPrice = (paneltoBattery * 4) + (batterytoHVAC * 6) + 33
    // console.log("customProductPrice ======== ", customProductPrice);



    const productData = {
      product: {
        title: `${paneltoBattery} Feet from Panels to Battery / ${batterytoHVAC} Feet from Battery to HVAC`,
        product_type: "Product",
        tags: ["CustomWiringKit"],
        images: [
          {
            src: "https://rakanonline.com/wp-content/uploads/2022/08/default-product-image.png"
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

    const createProducts = await fetch(`https://${session.shop}/admin/api/2024-07/products.json`, {
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