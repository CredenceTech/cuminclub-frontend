import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { userEmails } from "../state/user";
import LoadingAnimation from "./Loader";
import DataNotFound from "./DataNotFound";

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
          limit: 50,
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
        Object.keys(invoices).length === 0 ? <DataNotFound/> : <section className="body-font relative">
        <div className="container p-5 pt-10 mx-auto">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount Paid
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, i) => (
                  <tr
                    className="odd:bg-white  even:bg-gray-50  border-b "
                    key={i}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                    >
                      {invoice.customer_shipping.name}
                    </th>
                    <td className="px-6 py-4">{invoice.customer_email}</td>
                    <td className="px-6 py-4">{invoice.amount_paid}</td>
                    <td className="px-6 py-4">
                      <a
                        href={invoice.invoice_pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 font-semibold cursor-pointer leading-tight text-green-700 bg-green-100 rounded-sm"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
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
