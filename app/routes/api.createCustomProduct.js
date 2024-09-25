import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  try {
    const { admin, session } = await authenticate.public.appProxy(request);
    console.log("admin11111 ============", admin.rest.resources.Product);
    console.log("session ========== ", session);

    const requestData = await request.json()
    console.log("requestData ========== ", requestData);

    const { batterytoHVAC, paneltoBattery } = requestData

    //calculate Product price
    //Distance from Panels to Battery ___ ft ($a)
    //Distance from Battery to HVAC ___ ft ($b)
    //Price = $a*4+$b*6+33 

    const customProductPrice = (paneltoBattery * 4) + (batterytoHVAC * 6) + 33
    console.log("customProductPrice ======== ", customProductPrice);


    const productData = {
      product: {
        title: "Custom Wiring Kit",
        product_type: "Product",
        images : "https://www.carplus.in/cdn/shop/files/Monster-Wiring-Kit-M600K-0_82-WIRING-KIT-MONSTER-3_1000x.jpg?v=1706875010",
        variants: [
          {
            price: customProductPrice,
            sku: "CWK-Small",
            images: ["https://www.carplus.in/cdn/shop/files/Monster-Wiring-Kit-M600K-0_82-WIRING-KIT-MONSTER-3_1000x.jpg?v=1706875010"]
          }
        ],
        metafields: [
          {
            namespace: "seo",
            key: "hidden",
            type: "number_integer",
            value: "1"
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
    console.log("createdProductResponse ======= ", createdProductResponse);

    const getVarientID = createdProductResponse.product.id
    console.log("getVarientID =============== ", getVarientID);

    return getVarientID
  } catch (error) {
    console.log("error ============ ", error);
    return error
  }
}