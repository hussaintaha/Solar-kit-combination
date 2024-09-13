import shopifySessionModel from "../Database/session";


export const action = async ({ request }) => {
    try {
        const getdistance = await request.json()
        console.log("getdistance ==== ", getdistance);

        const { batterytoHVAC, paneltoBattery } = getdistance
        // $a*4+$b*6+33

        const sessionObject = await shopifySessionModel.findOne()

        const price = (batterytoHVAC * 4 + paneltoBattery * 6 + 33);
        console.log("price =========== ", price);


        const draftProductCreate = await fetch(`https://${sessionObject.shop}/admin/api/2024-01/graphql.json`, {
            method: "POST",
            headers: {
                'X-Shopify-Access-Token': "shpua_45bd5443fd68809e6d27c475469190eb",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `mutation {
                    productCreate(input: {title: "Sweet new product", productType: "Snowboard", vendor: "JadedPixel"}) {
                      product {
                        id
                      }
                    }
                  }`
            })
        });

        console.log("draftProductCreate ======== ", await draftProductCreate.json());




        return "f,ghjkh"
    } catch (error) {
        console.log("error in custom product API ====== ", error);
        return error
    }
}