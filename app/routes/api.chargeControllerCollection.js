import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    try {

        const { session } = await authenticate.public.appProxy(request);
        console.log("session =======", session);

        const urlString = request.url
        const url = new URL(urlString);

        const params = new URLSearchParams(url.search);

        const neededHarvestkWh = params.get('neededHarvestkWh');
        // console.log("neededHarvestkWh ======== ", neededHarvestkWh);

        let collectionID;
        let collectionName;
        if (neededHarvestkWh < 4) {
            collectionID = 428938887380
            collectionName = "A"
        }
        else if (neededHarvestkWh > 4 && neededHarvestkWh < 10) {
            collectionID = 428938952916
            collectionName = "B"
        }
        else if (neededHarvestkWh > 10 && neededHarvestkWh < 20) {
            collectionID = 428938985684
            collectionName = "C"
        }
        else if (neededHarvestkWh > 20) {
            collectionID = 428939018452
            collectionName = "D"
        }
        // console.log("collectionID ======== ", collectionID);


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