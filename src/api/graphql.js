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

export const graphQLClientAdmin = new GraphQLClient(
  "https://76ac20-2.myshopify.com/admin/api/2024-01/graphql.json",
  {
    headers: {
      "X-Shopify-Access-Token": import.meta.env.VITE_SHOPIFY_STOREFRONT_ADMIN_KEY,
      "Access-Control-Allow-Origin": "*"
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
        products(first: 250) {
          edges {
            node {
              id
              title
              handle
              description
              tags
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              sellingPlanGroups(first: 5) {
                edges {
                    node {
                    sellingPlans(first: 5) {
                        edges {
                        node {
                            id
                        }
                        }
                    }
                    }
                }
                }
              metafields(identifiers: [
                { namespace: "custom", key: "spice_level" },
                { namespace: "custom", key: "small_descriptions" },
                { namespace: "custom", key: "product_large_card_image" },
                { namespace: "custom", key: "product_small_card_image" },
                { namespace: "custom", key: "image_for_home" },
                { namespace: "custom", key: "rte" },
                { namespace: "custom", key: "rtc" },
                { namespace: "custom", key: "bulk" },
              ]) {
                value
                key
                reference {
                    ... on MediaImage {
                    image {
                        originalSrc
                        altText
                    }
                    }
                }
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
        lines(first: 100) {
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

export const updateCartItemMutation = gql`
mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(
    cartId: $cartId
    lines: $lines
  ) {
    cart {
      id
      lines(first: 100) {
        edges {
          node {
            id
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
      cost {
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
}`;

export const updateCartMutation = gql`
mutation addCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
    id
        lines(first: 100){
            edges
            {
                node{
                  id
                    quantity
                    merchandise{
                        ... on ProductVariant {   						
                            id
                        }
                    }
                }
            }
        }
        cost {
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
    userErrors {
      field
      message
    }
  }
}`;

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
            id
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
                  id
                  title
                  featuredImage {
                    altText
                    url
                  }
                  sellingPlanGroups(first: 5) {
                    edges {
                        node {
                        sellingPlans(first: 5) {
                            edges {
                            node {
                                id
                            }
                            }
                        }
                        }
                    }
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
  query getProductDetail($productId: ID!) {
    product(id: $productId) {
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
      images: images(first:10) {
        edges {
            node {
                altText
                src
            }
        }
    }
      handle
      variants(first: 10) {
        edges {
          node {
            id
            weight
            weightUnit
          }
        }
      }
      sellingPlanGroups(first: 5) {
        edges {
            node {
            sellingPlans(first: 5) {
                edges {
                node {
                    id
                }
                }
            }
            }
        }
        }
      metafields(identifiers: [
        { namespace: "custom", key: "spice_level" },
        { namespace: "custom", key: "how_to_prepare" },
        { namespace: "custom", key: "nutrition_facts" },
        { namespace: "custom", key: "ingredient" },
        {namespace: "custom", key: "component_reference"}
      ]) {
        value
        key
      }
    }
  }
`;

export const getProductRecommendedQuery = gql`
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
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
                  sellingPlanGroups(first: 5) {
                    edges {
                        node {
                        sellingPlans(first: 5) {
                            edges {
                            node {
                                id
                            }
                            }
                        }
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

export const updateCartItemsQuantityMutation = gql`
mutation {
  cartLinesUpdate(
    cartId: "gid://shopify/Cart/Z2NwLXVzLWNlbnRyYWwxOjAxSE1XWjE4WVNDVjYwSFdXNjdHRUYwODk4"
    lines: {
      id: "gid://shopify/CartLine/519c234e-1506-4773-b340-fdf45bae82eb?cart=Z2NwLXVzLWNlbnRyYWwxOjAxSE1XWjE4WVNDVjYwSFdXNjdHRUYwODk4"
      quantity: 0
    }
  ) {
    cart {
      id
      lines(first: 10) {
        edges {
          node {
            id
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
      cost {
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
}`;



export const createCheckoutURLMutation = gql`
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
}`;


export const checkoutConnectWithCustomerMutation = gql`
mutation associateCustomerWithCheckout($checkoutId: ID!, $customerAccessToken: String!) {
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
      id,
      firstName
      lastName
      email
      addresses (first:1){
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
}`;

export const createCustomerMutation = gql`
  mutation CreateCustomer($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        emailMarketingConsent {
          marketingState
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const getCustomerByEmailQuery = gql`
  query GetCustomerByEmail($email: String!) {
    customers(first: 1, query: $email) {
      edges {
        node {
          id
          email
          firstName
          lastName
        }
      }
    }
  }
`;

export const customerEmailMarketingConsentUpdateMutation = gql`
  mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer {
        id
        emailMarketingConsent {
          consentUpdatedAt
          marketingOptInLevel
          marketingState
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const getCategoriesQuery = gql`
{
   collections (first: 4){
        edges {
            node {
                id
                title
                description
                 image  {
                        id
                        altText
                        originalSrc
                        }
                handle
            }
        }
    }
}
`;

export const getRecipeListQuery = gql`
  query GetRecipeList($first: Int!) {
    metaobjects(first: $first, type: "recipes") {
      edges {
        node {
          id
          type
          handle
          fields {
            key
            value
          }
        }
      }
    }
  }
`;

export const getRecipeDetailsQuery = gql`
  query getRecipeDetails($handle: String!) {
    metaobject(handle: { handle: $handle, type: "recipes" }) {
      id
      type
      handle
      fields {
        key
        value
      }
    }
  }
`;

export const getRecipeStepsDetailsQuery = gql`
  query getRecipeDetails($id: ID!) {
    metaobject(id: $id) {
      id
      type
      handle
      fields {
        key
        value
      }
    }
  }
`;


export const getMediaImageQuery = gql`
  query getMediaImage($id: ID!) {
    node(id: $id) {
      ... on MediaImage {
        id
        alt
        mediaContentType
        image {
          url
        }
      }
    }
  }
`;


export const getDownloadPdfQuery = gql`
query getFileDetails($id: ID!) {
  node(id: $id) {
    ... on GenericFile {
      id
      alt
      url
    }
  }
}`;


export const getproductListQuery = gql`
query getProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean!) {
  products(first: $first, sortKey: $sortKey, reverse: $reverse) {
    edges {
      node {
        id
        title
      }
    }
  }
}
`;

export const getProductDetailsQuery = gql`
query GetProductDetails($id: ID!) {
  product(id: $id) {
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
    images(first: 10) {
      edges {
        node {
          altText
          src
        }
      }
    }
    handle
    variants(first: 10) {
      edges {
        node {
          id
          weight
          weightUnit
        }
      }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "spice_level" },
      { namespace: "custom", key: "how_to_prepare" },
      { namespace: "custom", key: "nutrition_facts" },
      { namespace: "custom", key: "ingredient" },
      { namespace: "custom", key: "component_reference" }
    ]) {
      value
      key
    }
  }
}
`;

export const getProductDetailFull = gql`
query getProductData($id: ID!) {
    product(id: $id) {
      id
      title
      description
      collections(first: 1) {
      edges {
        node {
          title
        }
      }
    }
      onlineStoreUrl
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            altText
            src
          }
        }
      }
      handle
      variants(first: 10) {
        edges {
          node {
            id
            weight
            weightUnit
          }
        }
      }
      metafields(identifiers: [
        { namespace: "custom", key: "spice_level" },
        { namespace: "custom", key: "how_to_prepare" },
        { namespace: "custom", key: "nutrition_facts" },
        { namespace: "custom", key: "ingredient" },
        { namespace: "custom", key: "component_reference" },
        { namespace: "custom", key: "rte" },
        { namespace: "custom", key: "rtc" },
        { namespace: "custom", key: "product_background_color" },
        { namespace: "custom", key: "product_text_color" },
        { namespace: "custom", key: "product_large_card_image" },
        { namespace: "custom", key: "product_small_card_image" },
        { namespace: "custom", key: "image_for_home" },
        { namespace: "custom", key: "add_product_steps" },
        { namespace: "shopify--discovery--product_recommendation", key: "related_products" }
         { namespace: "custom", key: "add_feedbacks" },
         { namespace: "custom", key: "bulk" },
      ]) {
        value
        key
        reference {
          ... on MediaImage {
            image {
              originalSrc
              altText
            }
          }
        }
      }
      relatedProducts: metafield(namespace: "shopify--discovery--product_recommendation", key: "related_products") {
        value
        references(first: 10) {
          edges {
            node {
              ... on Product {
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
                metafield(namespace: "custom", key: "image_for_home") {
                  value
                  reference {
                    ... on MediaImage {
                      image {
                        originalSrc
                        altText
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
  }

`;

export const getStepDetails = gql`
  query getStepDetails($id: ID!) {
    metaobject(id: $id) {
      id
      type
      handle
      fields {
        key
        value
        reference {
          ... on Video {
            sources {
              url
            }
          }
        }
      }
    }
  }
`;
export const getFeedbackDetails = gql`
  query getFeedbackDetails($id: ID!) {
  metaobject(id: $id) {
    id
    fields {
      key
      value
  }
  }
  }
`;

export const getProductDetailByHandle = gql`
query productByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      collections(first: 1) {
      edges {
        node {
          title
        }
      }
    }
      onlineStoreUrl
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            altText
            src
          }
        }
      }
      handle
      variants(first: 10) {
        edges {
          node {
            id
            weight
            weightUnit
          }
        }
      }
      metafields(identifiers: [
        { namespace: "custom", key: "spice_level" },
        { namespace: "custom", key: "how_to_prepare" },
        { namespace: "custom", key: "nutrition_facts" },
        { namespace: "custom", key: "ingredient" },
        { namespace: "custom", key: "component_reference" },
        { namespace: "custom", key: "rte" },
        { namespace: "custom", key: "rtc" },
        { namespace: "custom", key: "product_background_color" },
        { namespace: "custom", key: "product_text_color" },
        { namespace: "custom", key: "product_large_card_image" },
        { namespace: "custom", key: "product_small_card_image" },
        { namespace: "custom", key: "image_for_home" },
        { namespace: "custom", key: "add_product_steps" },
        { namespace: "shopify--discovery--product_recommendation", key: "related_products" }
         { namespace: "custom", key: "add_feedbacks" },
         { namespace: "custom", key: "bulk" },
      ]) {
        value
        key
        reference {
          ... on MediaImage {
            image {
              originalSrc
              altText
            }
          }
        }
      }
      relatedProducts: metafield(namespace: "shopify--discovery--product_recommendation", key: "related_products") {
        value
        references(first: 10) {
          edges {
            node {
              ... on Product {
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
                metafield(namespace: "custom", key: "image_for_home") {
                  value
                  reference {
                    ... on MediaImage {
                      image {
                        originalSrc
                        altText
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
  }
`;

