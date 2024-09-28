import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    try {
        const { session } = await authenticate.public.appProxy(request);
        const urlString = request.url;
        const url = new URL(urlString);
        const params = new URLSearchParams(url.search);
        const recommendedBTU = params.get('recommendedBTU');

        let collectionID;
        let collectionName;
        if (recommendedBTU < 10000) {
            collectionID = 428938887380;
            collectionName = "A";
        } else if (recommendedBTU > 10000 && recommendedBTU < 18000) {
            collectionID = 428938952916;
            collectionName = "B";
        } else if (recommendedBTU > 18000) {
            collectionID = 428938985684;
            collectionName = "C";
        }

        const fetchCollectionProducts = await fetch(`https://${session.shop}/admin/api/2024-01/collections/${collectionID}/products.json`, {
            method: "GET",
            headers: {
                'X-Shopify-Access-Token': session.accessToken,
                'Content-Type': 'application/json'
            }
        });

        const collectionsProducts = await fetchCollectionProducts.json();
        const collectionproductDetails = collectionsProducts.products;

        const productImages = {};
        const productTitles = {};
        collectionproductDetails.forEach(product => {
            if (product.images.length > 0) {
                productImages[product.id] = product.images[0];
            }
            productTitles[product.id] = product.title;
        });

        const collectionproductsId = collectionproductDetails.map(product => product.id);

        const fetchProductsVariants = await Promise.all(
            collectionproductsId.map(async (productId) => {
                const fetchVariants = await fetch(`https://${session.shop}/admin/api/2024-01/products/${productId}/variants.json`, {
                    method: "GET",
                    headers: {
                        'X-Shopify-Access-Token': session.accessToken,
                        'Content-Type': 'application/json'
                    }
                });
                const variantsData = await fetchVariants.json();
                return variantsData.variants.map(variant => ({
                    ...variant,
                    image: productImages[productId],
                    title: variant.title === "Default Title" ? productTitles[productId] : `${productTitles[productId]}/${variant.title}`
                }));
            })
        );

        const allVariants = fetchProductsVariants.flat();
        // console.log("allVariants ========= ", allVariants);
        console.log("varient Length === ", allVariants.length);

        return {
            data: allVariants,
            collectionName,
        };
    } catch (error) {
        console.log("error ==== ", error);
        return { error: error.message };
    }
};
