import { authenticate } from "../shopify.server";


export const loader = async ({ request }) => {
    try {
        console.log('request ======= ', request.url);

        const { session } = await authenticate.public.appProxy(request);
        console.log("session =======", session);

        const urlString = request.url
        const url = new URL(urlString);

        const params = new URLSearchParams(url.search);

        const neededHarvestkWh = params.get('neededHarvestkWh');
        console.log("neededHarvestkWh ======== ", neededHarvestkWh);

        let collectionID;
        if (neededHarvestkWh < 4000) {
            collectionID = 428015648980
        } else if (neededHarvestkWh > 4000 && neededHarvestkWh < 10000) {
            collectionID = 428015681748
        } else if (neededHarvestkWh > 10000 && neededHarvestkWh < 20000) {
            collectionID = 428015681748
        } else if (neededHarvestkWh > 20000) {
            collectionID = 428015616212
        }

        console.log("collectionID ======== ", collectionID);

        const fetchCollectionProducts = await fetch(`https://${session.shop}/admin/api/2024-01/collections/${collectionID}/products.json`, {
            method: "GET",
            headers: {
                'X-Shopify-Access-Token': session.accessToken,
                'Content-Type': 'application/json'
            }
        });

        const collectionsProducts = await fetchCollectionProducts.json()
        // console.log("collectionsProducts ========= ", collectionsProducts);

        return {
            data: collectionsProducts
        }



        return true
    } catch (error) {
        console.log("error in solarPannel API ==========", error);
        return error

    }
}