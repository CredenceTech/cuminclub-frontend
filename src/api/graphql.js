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
  products(first: 100, reverse: true) {
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
        variants(first: 10){
            edges {
                node {
                    id
                    weight
                    weightUnit
                }
            }
        }
        metafields(identifiers: 
            [
                {namespace: "custom", key: "spice_level"},
                {namespace: "custom", key: "small_descriptions"},
            ]) {
            value
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


export const getProductCollectionsQuery = gql`
query GetCollections($first: Int!, $reverse: Boolean!, $query: String!) {
  collections(first: $first, reverse: $reverse, query: $query) {
    edges {
      node {
        title
        id
        description
        products(first: 15) {
          edges {
            node {
              id
              title
              description
              tags
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              metafields(identifiers: [
                { namespace: "custom", key: "spice_level" },
                { namespace: "custom", key: "small_descriptions" },
              ]) {
                value
                key
              }
              featuredImage {
                altText
                url
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    weight
                    weightUnit
                  }
                }
              }
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

export const deleteAddressMutation = gql`
      mutation DeleteAddress(
        $customerAccessToken: String!, 
        $addressId: ID!,
      ) {
        customerAddressDelete(
          customerAccessToken: $customerAccessToken, 
          id: $addressId
        ) {
          deletedCustomerAddressId
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

export const updateCustomerInfoMutation = gql`
    mutation UpdateCustomerInfo(
      $customerAccessToken: String!, 
      $email: String,
      $firstName: String,
      $lastName: String,
      $acceptsMarketing: Boolean,
    ) {
      customerUpdate(
        customerAccessToken: $customerAccessToken,
        customer: {
          email: $email, 
          firstName: $firstName, 
          lastName: $lastName,
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
        userErrors {
          message
        }
      }
    }
  `;

export const sendPasswordResetEmailMutation = gql`
      mutation SendPasswordResetEmail($email: String!) {
        customerRecover(email: $email) {
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

export const createCartMutation = gql`
  mutation CreateCart($cartInput: CartInput) {
    cartCreate(input: $cartInput) {
      cart {
        id
        createdAt
        updatedAt
        lines(first: 10) {
          edges {
            node {
              id
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
        attributes {
          key
          value
        }
        estimatedCost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
          totalDutyAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export const getCartQuery = gql`
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      checkoutUrl
      estimatedCost {
        totalAmount {
          amount
        }
      }
      lines(first: 100) {
        edges {
          node {
            quantity
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            merchandise {
              ... on ProductVariant {
                title
                id
                product {
                  title
                  featuredImage {
                    altText
                    url
                  }
                  handle
                }
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const checkoutShippingAddressUpdateMutation = gql`
  mutation CheckoutShippingAddressUpdateV2($shippingAddress: MailingAddressInput!, $checkoutId: ID!) {
    checkoutShippingAddressUpdateV2(shippingAddress: $shippingAddress, checkoutId: $checkoutId) {
      checkoutUserErrors {
        code
        field
        message
      }
      checkout {
        id
        shippingAddress {
          firstName
          lastName
          address1
          province
          country
          zip
        }
      }
    }
  }
`;

export const CheckoutCreateMutation = gql`
  mutation CheckoutCreate($lineItems: [CheckoutLineItemInput!]!) {
    checkoutCreate(input: {
      lineItems: $lineItems
    }) {
      checkout {
        id
        webUrl
        lineItems(first: 5) {
          edges {
            node {
              title
              quantity
            }
          }
        }
      }
    }
  }
`;

export const associateCustomerWithCheckoutMutation = gql`
  mutation AssociateCustomerWithCheckout($checkoutId: ID!, $customerAccessToken: String!) {
    checkoutCustomerAssociateV2(checkoutId: $checkoutId, customerAccessToken: $customerAccessToken) {
      checkout {
        id
        lineItems(first: 50) {
          edges {
            node {
              title
              quantity
              variant {
                id
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
      checkoutUserErrors {
        code
        field
        message
      }
      customer {
        id
        firstName
        lastName
        email
        addresses(first: 1) {
          edges {
            node {
              address1
              address2
              city
              country
              name
              phone
              province
              zip
            }
          }
        }
      }
    }
  }
`;

export const getPageByHandleQuery = gql`
  query GetPageByHandle($handle: String!) {
    page(handle: $handle) {
      id
      title
      body
    }
  }
`;


export const getProductDetailQuery = gql`
  query {
    product(id: "gid://shopify/Product/8264166506722") {
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
      variants(first: 10){
          edges {
              node {
                  id
                  weight
                  weightUnit
              }
          }
      }
      metafields(identifiers: 
          [
              {namespace: "custom", key: "spice_level"},
              {namespace: "custom", key: "how_to_prepare"},
              {namespace: "custom", key: "nutrition_facts"},
              {namespace: "custom", key: "ingredient"}
          ]) {
          value
          key
      }
    }
  }
`;



export const getProductRecommendedQuery = gql`
  query getProductRecommendations {
    productRecommendations(productId: "gid://shopify/Product/8264168145122") {
      id
      title
      description
      variants(first: 5) {
        edges {
          cursor
          node {
              product {
                  id
                  handle
                  title
                  description
                  metafields(identifiers: 
                      [
                          {namespace: "custom", key: "spice_level"},
                          {namespace: "custom", key: "small_descriptions"},
                      ]) {
                      value
                      key
                  }
              }
            id
            title
            image {
              id
              url
            }
            quantityAvailable
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const getPagePrivacyPolicyQuery = gql`
query getShopPolicies {
	shop {
		privacyPolicy {
			id
			body # Policy text, maximum size of 64kb.
			title
		}
	}
}`;

export const getPageAccessibilityQuery = gql`
query getPageByHandle($handle: String!) {
	page(handle: $handle) {
		id
		title
        body
	}
}`;

export const getPageRefundQuery = gql`
query getShopPolicies {
	shop {
		refundPolicy {
			id
			body # Policy text, maximum size of 64kb.
			title
		}
	}
}`;

export const getPageTermOfServiceQuery = gql`
query getShopPolicies {
	shop {
		termsOfService {
			id
			body # Policy text, maximum size of 64kb.
			title
		}
	}
}`;



