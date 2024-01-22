import React, { useState } from "react";
import {
  createAddressMutation,
  deleteAddressMutation,
  fetchCustomerInfoQuery,
  getAllProductsQuery,
  graphQLClient,
  registerAccountMutation,
  sendPasswordResetEmailMutation,
  setDefaultAddressMutation,
  signInMutation,
  updateAddressMutation,
  updateCustomerInfoMutation,
} from "../api/graphql";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    acceptsMarketing: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: inputValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const response = await graphQLClient.request(registerAccountMutation, formData);
    // const response = await graphQLClient.request(signInMutation, {
    //   email: "anuj@test.com",
    //   password: "AnujAnuj",
    // });
    // const response = await graphQLClient.request(fetchCustomerInfoQuery, {
    //   customerAccessToken: "323bdbb15344314843aec1c6aa38a7d6",
    // });
  //   const response = await graphQLClient.request(createAddressMutation, {
  //     "customerAccessToken": "323bdbb15344314843aec1c6aa38a7d6",
  //     "address1": "6977, Surat",
  //     "country": "India",
  //     "province": "Jharkhand",
  //     "city": "Surat",
  //     "zip": "825412"   
  // })
  // const response = await graphQLClient.request(updateAddressMutation, {
  //   "addressId": "gid://shopify/MailingAddress/8738266677474?model_name=CustomerAddress&customer_access_token=QgfTKrA06VC-G8OuPWWMYTYUzYZSbCs3z8OeIMlOsxIremoovwSnwqCj6UmQGH1vj2RQ-agMlNZuQvrj67HyVaBRmEO8LyPNJudjlg6g5KtgaEx4zLz8Rp5Jtcg-KdheGUMyD7WIhwzdJBOxWGYqGiM8zt7ECTy_i8o6ROUTjrpk47an3FXE5VwY598k6-KEXw1niOuuiYgOlkWIMaGjSnjKTdlU98HReNGsh2tMpnss6Iw6QP7hd2_YLPGaitNw",
  //   "customerAccessToken": "323bdbb15344314843aec1c6aa38a7d6",
  //   "address1": "6977, Hazaribagh",
  //   "country": "India",
  //   "province": "Jharkhand",
  //   "city": "Hazaribagh",
  //   "zip": "21162"
  // });
  // const response = await graphQLClient.request(setDefaultAddressMutation, {
  //   "addressId": "gid://shopify/MailingAddress/8738266677474?model_name=CustomerAddress&customer_access_token=QgfTKrA06VC-G8OuPWWMYTYUzYZSbCs3z8OeIMlOsxIremoovwSnwqCj6UmQGH1vj2RQ-agMlNZuQvrj67HyVaBRmEO8LyPNJudjlg6g5KtgaEx4zLz8Rp5Jtcg-KdheGUMyD7WIhwzdJBOxWGYqGiM8zt7ECTy_i8o6ROUTjrpk47an3FXE5VwY598k6-KEXw1niOuuiYgOlkWIMaGjSnjKTdlU98HReNGsh2tMpnss6Iw6QP7hd2_YLPGaitNw",
  //   "customerAccessToken": "323bdbb15344314843aec1c6aa38a7d6",
  // });
  // const response = await graphQLClient.request(deleteAddressMutation, {
  //   "addressId": "gid://shopify/MailingAddress/8738266677474?model_name=CustomerAddress&customer_access_token=QgfTKrA06VC-G8OuPWWMYTYUzYZSbCs3z8OeIMlOsxIremoovwSnwqCj6UmQGH1vj2RQ-agMlNZuQvrj67HyVaBRmEO8LyPNJudjlg6g5KtgaEx4zLz8Rp5Jtcg-KdheGUMyD7WIhwzdJBOxWGYqGiM8zt7ECTy_i8o6ROUTjrpk47an3FXE5VwY598k6-KEXw1niOuuiYgOlkWIMaGjSnjKTdlU98HReNGsh2tMpnss6Iw6QP7hd2_YLPGaitNw",
  //   "customerAccessToken": "323bdbb15344314843aec1c6aa38a7d6",
  // });
  // const response = await graphQLClient.request(updateCustomerInfoMutation, {
  //   "customerAccessToken": "323bdbb15344314843aec1c6aa38a7d6",
  //   "firstName": "Prahlad",
  //   "lastName": "Verma"
  // });
  // const response = await graphQLClient.request(sendPasswordResetEmailMutation, {
  //   "email": "test@up.com",
  // });
  const response = await graphQLClient.request(getAllProductsQuery);

    console.log(response, "Response");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="firstName"
            name="firstName"
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="acceptsMarketing"
          >
            Accept Marketing
          </label>
          <input
            className="mr-2 leading-tight"
            id="acceptsMarketing"
            name="acceptsMarketing"
            type="checkbox"
            checked={formData.acceptsMarketing}
            onChange={handleInputChange}
          />
          <span className="text-sm">I accept marketing terms</span>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
