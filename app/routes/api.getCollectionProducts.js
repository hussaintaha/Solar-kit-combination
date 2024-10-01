import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    try {
        // Authenticate and get admin client for API access
        const { admin } = await authenticate.public.appProxy(request);

        // Parse the URL to get the recommendedBTU query parameter
        const url = new URL(request.url);
        const params = new URLSearchParams(url.search);
        const recommendedBTU = parseInt(params.get('recommendedBTU'), 10);

        // Initialize the array of variant IDs based on the recommendedBTU range        
        let variantId = [];

        // If BTU is less than 10,000, select the corresponding variant IDs
        if (recommendedBTU < 10000) {
            variantId = [45672874803412, 45672874475732, 45672871526612]; // Replace these IDs with the correct ones if needed
        }
        // If BTU is between 10,000 and 18,000, select another set of variant IDs
        else if (recommendedBTU >= 10000 && recommendedBTU <= 18000) {
            variantId = [45672874475732, 45672871526612, 45672874574036]; // Replace these IDs with the correct ones if needed
        }
        // If BTU is greater than 18,000, select a third set of variant IDs
        else if (recommendedBTU > 18000) {
            variantId = [45672873066708, 45672871493844, 45672874541268, 45672874442964]; // Replace these IDs with the correct ones if needed
        }

        const fetchVariant = async (id) => {
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
                    price
                  }
                }`
            );
            return response.json();
        };

        const fetchProductsVariants = await Promise.all(
            variantId.map(id => fetchVariant(id))
        );

        // Extract the productVariant data from the responses and filter out any failed requests
        const productVariantsData = fetchProductsVariants
            .map(response => response?.data?.productVariant)
            .filter(variant => variant); // Filter out null or undefined variants

        // Log the fetched product variants for debugging
        console.log("productVariantsData ======= ", productVariantsData);

        // Return the fetched product variants data
        return productVariantsData;

    } catch (error) {
        // Log any errors that occur and return the error message
        console.log("Error fetching product variants:", error);
        return { error: error.message };
    }
};





// const fetchVariants = await fetch(`https://${session.shop}/admin/api/2024-07/variants/45672875032788.json`, {
//     method: "GET",
//     headers: {
//         'X-Shopify-Access-Token': session.accessToken,
//         'Content-Type': 'application/json'
//     }
// });
// const variantsData = await fetchVariants.json();
// console.log("variantsData ========== ", variantsData);

// return variantsData.variants.map(variant => ({
//     ...variant,
//     image: productImages[productId],
//     title: variant.title === "Default Title" ? productTitles[productId] : `${productTitles[productId]}/${variant.title}`
// }));





// const fetchCollectionProducts = await fetch(`https://${session.shop}/admin/api/2024-01/collections/${collectionID}/products.json`, {
//     method: "GET",
//     headers: {
//         'X-Shopify-Access-Token': session.accessToken,
//         'Content-Type': 'application/json'
//     }
// });

// const collectionsProducts = await fetchCollectionProducts.json();
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
