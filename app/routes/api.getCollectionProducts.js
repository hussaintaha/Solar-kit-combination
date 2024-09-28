import { authenticate } from "../shopify.server";


export const loader = async ({ request }) => {
    try {

        const { session } = await authenticate.public.appProxy(request);
        // console.log("session =======", session);

        const urlString = request.url
        const url = new URL(urlString);

        const params = new URLSearchParams(url.search);

        const recommendedBTU = params.get('recommendedBTU');
        console.log("recommendedBTU ======== ", recommendedBTU);

        let collectionID;
        let collectionName;
        if (recommendedBTU < 10000) {
            collectionID = 428938887380
            collectionName = "A"
        } else if (recommendedBTU > 10000 && recommendedBTU < 18000) {
            collectionID = 428938952916
            collectionName = "B"
        } else if (recommendedBTU > 18000) {
            collectionID = 428938985684
            collectionName = "C"
        }



        const fetchCollectionProducts = await fetch(`https://${session.shop}/admin/api/2024-01/collections/${collectionID}/products.json`, {
            method: "GET",
            headers: {
                'X-Shopify-Access-Token': session.accessToken,
                'Content-Type': 'application/json'
            }
        });

        const collectionsProducts = await fetchCollectionProducts.json()
        console.log("collectionsProducts ========= ", collectionsProducts);

        return {
            data: collectionsProducts,
            collectionName: collectionName
        }
        return true;
    } catch (error) {
        console.log("error ==== ", error);
        return error;
    }
}