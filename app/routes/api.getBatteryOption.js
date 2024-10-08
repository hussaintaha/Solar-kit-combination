import { authenticate } from "../shopify.server";
import batteryOptionsCollection from "../Database/collections/batteryOptionsModel";

export const loader = async ({ request }) => {
    try {
        const { session, admin } = await authenticate.public.appProxy(request);
        // console.log("session =======", session);

        const urlString = request.url
        const url = new URL(urlString);

        const params = new URLSearchParams(url.search);

        // Get the value of 'neededHarvestkWh' from the URL query string
        const neededHarvestkWh = params.get('neededHarvestkWh');
        // console.log("neededHarvestkWh ======== ", neededHarvestkWh);
        let harvestValue;

        if (neededHarvestkWh < 4) {
            harvestValue = "lessThan4kWh";
        } else if (neededHarvestkWh >= 4 && neededHarvestkWh < 10) {
            harvestValue = "4to10kWh";
        } else if (neededHarvestkWh >= 10 && neededHarvestkWh < 20) {
            harvestValue = "10to20kWh";
        } else if (neededHarvestkWh >= 20) {
            harvestValue = "greaterThan20kWh";
        }

        console.log(`Determined harvest Range: ${harvestValue}`)

        const productsInRange = await batteryOptionsCollection.find({ harvestValue: harvestValue });
        if (productsInRange.length) {
            console.log("productsInRange ======= ", productsInRange);
            return { products: productsInRange[0].products };
        } else {
            console.log(`No products found for harvest value: ${harvestValue}`);
            return { products: [] };
        }

    } catch (error) {
        console.log("error in solarPannel API ==========", error);
        return error

    }
}








// const fetchCollectionProducts = await fetch(`https://${session.shop}/admin/api/2024-01/collections/${collectionID}/products.json`, {
//     method: "GET",
//     headers: {
//         'X-Shopify-Access-Token': session.accessToken,
//         'Content-Type': 'application/json'
//     }
// });

// const collectionsProducts = await fetchCollectionProducts.json()
// // console.log("collectionsProducts ========= ", collectionsProducts);
// const collectionproductDetails = collectionsProducts.products;

// const productImages = {};
// const productTitles = {};

// collectionproductDetails.forEach(product => {
//     if (product.images.length > 0) {
//         productImages[product.id] = product.images[0];
//     }
//     productTitles[product.id] = product.title;
// });


// const collectionproductsId = collectionproductDetails.map(product => product.id);
