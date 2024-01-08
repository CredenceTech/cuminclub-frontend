import "./App.css";
import { useEffect } from "react";
import { GraphQLClient, gql } from "graphql-request";

const graphQLClient = new GraphQLClient(
  "https://76ac20-2.myshopify.com/admin/api/2024-01/graphql.json",
  {
    headers: {
      "X-Shopify-Storefront-Access-Token": import.meta.env.VITE_SHOPIFY_STOREFRONT_KEY,
    },
  }
);

export async function getProducts() {
  const getAllProductsQuery = gql`
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
              }
            }
            featuredImage {
              altText
              url
            }
          }
        }
      }
    }
  `;
  try {
    return await graphQLClient.request(getAllProductsQuery);
  } catch (error) {
    throw new Error(error);
  }
}

function App() {
  
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <h1 className="text-red-500 font-bold text-lg">Cumin Club</h1>
    </>
  );
}

export default App;
