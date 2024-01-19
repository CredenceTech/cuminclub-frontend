import { GraphQLClient, gql } from 'graphql-request';

export const graphQLClient = new GraphQLClient(
    "https://76ac20-2.myshopify.com/api/2024-01/graphql.json",
    {
        headers: {
            "X-Shopify-Storefront-Access-Token": import.meta.env
                .VITE_SHOPIFY_STOREFRONT_KEY,
        },
    }
);

export const registerAccountMutation = gql`
  mutation RegisterAccount(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $acceptsMarketing: Boolean = false
  ) {
    customerCreate(
      input: {
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
        acceptsMarketing: $acceptsMarketing
      }
    ) {
      customer {
        id
      }
      customerUserErrors {
        code
        message
      }
    }
  }
`;

export const signInMutation = gql`
      mutation SignInWithEmailAndPassword($email: String!, $password: String!) {
        customerAccessTokenCreate(input: { 
          email: $email, 
          password: $password
        }) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            message
          }
        }
      }
    `;

export const logoutMutation = gql`
            mutation DeleteAccessToken($customerAccessToken: String!) {
            customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
                deletedAccessToken
            }
        }
    `;

export const getAllProductsQuery = gql`
{
    products(first: 20, reverse: true) {
      edges {
        node {
          id
          title
          description
          onlineStoreUrl
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            altText
            url
          }
          handle
          variants(first: 10) {
            edges {
              node {
                id
                title 
                weight
                weightUnit
              }
            }
          }
          metafield(namespace: "custom", key: "spice_level") {
            value
            type
            key
          }
          images(first: 5) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
        }
      }
    }
  }
  `;

 export const fetchCustomerInfoQuery = gql`
      query FetchCustomerInfo($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          email
          firstName
          id
          lastName
          defaultAddress {
            id
          }
          addresses(first: 100) {
            edges {
              node {
                address1
                city
                country
                id
                province
                zip
              }
            }
          }
        }
      }
    `;

export const createAddressMutation = gql`
      mutation CreateAddress(
        $customerAccessToken: String!,
        $address1: String!,
        $country: String!,
        $province: String!,
        $city: String!,
        $zip: String!
      ) {
        customerAddressCreate(
          customerAccessToken: $customerAccessToken
          address: {
            address1: $address1,
            country: $country,
            province: $province,
            city: $city,
            zip: $zip
          }
        ) {
          customerAddress {
            id
          }
          customerUserErrors {
            code
            message
          }
        }
      }
    `;

 export const updateAddressMutation = gql`
      mutation UpdateAddress(
        $addressId: ID!,
        $customerAccessToken: String!,
        $address1: String!,
        $country: String!,
        $province: String!,
        $city: String!,
        $zip: String!
      ) {
        customerAddressUpdate(
          id: $addressId,
          customerAccessToken: $customerAccessToken,
          address: {
            address1: $address1,
            country: $country,
            province: $province,
            city: $city,
            zip: $zip
          }
        ) {
          customerAddress {
            id
          }
          customerUserErrors {
            code
            message
          }
          userErrors {
            message
          }
        }
      }
    `;

 export const setDefaultAddressMutation = gql`
      mutation SetDefaultAddress(
        $customerAccessToken: String!, 
        $addressId: ID!,
      ) {
        customerDefaultAddressUpdate(
          customerAccessToken: $customerAccessToken,
          addressId: $addressId
        ) {
          customer {
            defaultAddress {
              id
            }
          }
          customerUserErrors {
            code
            message
          }
        }
      }
    `;