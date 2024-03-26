import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userEmails } from "../state/user";
import LoadingAnimation from "./Loader";

const Invoices = () => {
  const userEmail = useSelector(userEmails);
  const [invoices, setInvoices] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const url = `${
          import.meta.env.VITE_SHOPIFY_API_URL
        }/stripe/invoices/customers`;

        const params = {
          email: userEmail,
          limit: 20,
        };

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        const data = await response.json();
        setInvoices(data.data);
      } catch (error) {
        console.error("Error fetching Get Store Detail:", error);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div>
      {invoices !== null ? (
        <div className="flex bg-white  justify-center flex-wrap">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="m-2 w-50 lg:w-72 product-box-Shadow border rounded-2xl border-[#CFCFCF] flex flex-col items-center h-48 p-2 lg:p-4">
              {/* <p className="lg:text-sm">Invoice ID: {invoice.id}</p> */}
              <p className="mb-2">Name: <span className="text-gray-500">{invoice.customer_shipping.name}</span></p>
              <p className="mb-2">Amount Paid: <span className="text-gray-500">{invoice.amount_paid}</span></p>
              <p className="mb-2">Email: <span className="text-gray-500">{invoice.customer_email}</span></p>
              <p className="mb-2">Status: <span className="text-gray-500">{invoice.status}</span></p>
              <a
                href={invoice.invoice_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer mb-2 rounded py-1 px-2 bg-[#53940F] text-white"
              >
                Download PDF
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="flex justify-center items-center"
          style={{
            height: "90vh",
          }}
        >
          <LoadingAnimation />
        </div>
      )}
    </div>
  );
};

export default Invoices;
