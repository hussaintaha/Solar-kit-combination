import { apiVersion } from "../shopify.server";

export const shopifyGraphql = async (session, query) => {
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
            const reponseJson = await response.json()
            console.log("reponseJson ==== ", reponseJson);
            return reponseJson
        }


        return true

    } catch (error) {
        console.log("error in shopifyGraphql:", error);
        return error
    }
}