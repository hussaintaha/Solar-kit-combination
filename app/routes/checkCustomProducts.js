import { request } from "http";
import shopifySessionModel from "../Database/session";
import { shopifyGraphql } from "./utils";


export const checkCustomProducts = async () => {
    try {
        const currentDate = new Date();
        const session = await shopifySessionModel.findOne();

        if (!session) {
            throw new Error("No session found.");
        }


        const query = `
            query {
              products(first: 250, query: "tag:CustomWiringKit") {
                edges {
                  node {
                    id
                    title
                    createdAt
                  }
                }
                pageInfo {
                  hasNextPage
                }
              }
            }`

        // get all custom product
        const findCustomProducts = await shopifyGraphql(session, query);
        console.log("findCustomProducts ===== ", findCustomProducts.data.products.edges);



        if (findCustomProducts && findCustomProducts?.data?.products?.edges.length > 0) {

            const productsList = findCustomProducts.data.products.edges;
            // console.log("productsList ======= ", productsList);

            const productsToDelete = productsList.filter(product => {
                const productDate = new Date(product.node.createdAt);
                const hoursDifference = (currentDate - productDate) / (1000 * 60 * 60); // Calculate difference in hours
                return hoursDifference > 72;
            });
            console.log("productsToDelete === ", productsToDelete);

            if (productsToDelete.length > 0) {

                for (const product of productsToDelete) {
                    const productDeleteQuery = `
                    mutation {
                        productDelete(input: {id: "${product.node.id}"}) {
                            deletedProductId
                            userErrors {
                                field
                                message
                            }
                        }
                    }`;

                    const deleteProductResponse = await shopifyGraphql(session, productDeleteQuery);
                    if (deleteProductResponse && deleteProductResponse.data) {
                        console.log(`Product deleted: ${deleteProductResponse.data.productDelete.deletedProductId}`);
                    } else {
                        console.log(`Failed to delete product with ID: ${product.node.id}`);
                    }
                }
            }
        }


    } catch (error) {
        console.log("error in checkCustomProducts", error);
        return error
    }


}

