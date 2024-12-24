
export const shopifyGraphql = async (session, apiVersion, query) => {
    try {
        const response = await fetch(`https://${session.shop}/admin/api/${apiVersion}/graphql.json`, {
            method: "POST",
            headers: {
                'X-Shopify-Access-Token': session.accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query })
        });

        if (response.status === 200) {
            const responseJson = await response.json();
            console.log("Shopify GraphQL Response:", responseJson);
            return responseJson;
        } else {
            console.error("Shopify GraphQL request failed:", response.statusText);
            return false;
        }
    } catch (error) {
        console.log("error in shopifyGraphql:", error);
        return error
    }
}