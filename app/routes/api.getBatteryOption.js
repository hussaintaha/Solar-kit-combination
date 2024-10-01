import { authenticate } from "../shopify.server";


export const loader = async ({ request }) => {
    try {
        console.log('request ======= ', request.url);

        const { session, admin } = await authenticate.public.appProxy(request);
        console.log("session =======", session);

        const urlString = request.url
        const url = new URL(urlString);

        const params = new URLSearchParams(url.search);

        // Get the value of 'neededHarvestkWh' from the URL query string
        const neededHarvestkWh = params.get('neededHarvestkWh');
        console.log("neededHarvestkWh ======== ", neededHarvestkWh);

        // Initialize the array of variant IDs based on the neededHarvestkWh range
        let variantId = [];
        if (neededHarvestkWh < 4) {
            variantId = [45672874803412, 45672874475732, 45672871526612]; // Set these IDs for the range below 4kWh
        }
        else if (neededHarvestkWh > 4 && neededHarvestkWh < 10) {
            variantId = [45672874803412, 45672874475732, 45672871526612]; // Set these IDs for the 4-10kWh range
        }
        else if (neededHarvestkWh > 10 && neededHarvestkWh < 20) {
            variantId = [45672874803412, 45672874475732, 45672871526612]; // Set these IDs for the 10-20kWh range
        }
        else if (neededHarvestkWh > 20) {
            variantId = [45672874803412, 45672874475732, 45672871526612]; // Set these IDs for the range above 20kWh
        }

        // Fetch product variants for the given IDs
        const fetchProductsVariants = [];


        // Sequentially fetch product variants for each ID
        for (let id of variantId) {
            const response = await admin.graphql(
                `#graphql
                query {
                  productVariant(id: "gid://shopify/ProductVariant/${id}") {
                    id
                    image {
                      id
                      url
                    }
                    title
                  }
                }`
            );

            const data = await response.json();
            fetchProductsVariants.push(data.data.productVariant);
        }
        console.log("fetchProductsVariants ======= ", fetchProductsVariants);

        // Return the fetched product variants
        return fetchProductsVariants;

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
