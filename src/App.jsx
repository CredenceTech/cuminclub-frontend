import { useEffect } from "react";
import { GraphQLClient, gql } from "graphql-request";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./component/Home";

const graphQLClient = new GraphQLClient(
  "https://76ac20-2.myshopify.com/api/2024-01/graphql.json",
  {
    headers: {
      "X-Shopify-Storefront-Access-Token": import.meta.env
        .VITE_SHOPIFY_STOREFRONT_KEY,
    },
  }
);

const registerAccountMutation = gql`
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

function App() {
  
  async function registerAccount({
    email,
    password,
    firstName,
    lastName,
    acceptsMarketing = false,
  }) {
    try {
      const variables = {
        email,
        password,
        firstName,
        lastName,
        acceptsMarketing,
      };

      const response = await graphQLClient.request(
        registerAccountMutation,
        variables
      );

      console.log(response, "Response");
      return response;
    } catch (error) {
      console.error("Error registering account:", error);
      throw new Error("Error registering account");
    }
  }

  useEffect(() => {
    const signupUser = async () => {
      try {
        await registerAccount({
          email: "test@example.com",
          password: "securepassword",
          firstName: "Test",
          lastName: "Test",
          acceptsMarketing: true,
        });
      } catch (error) {
        console.error("Signup error:", error.message);
      }
    };

    signupUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
