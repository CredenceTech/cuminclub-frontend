import React, { useState } from 'react';

const Popup = () => {
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(true); // Initially, the popup is open

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can implement logic to send the email here
    console.log('Email submitted:', email);
    // Close the popup
    setIsOpen(false);
  };

  return (
    <div className={`fixed top-0 left-0  w-full h-full flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="absolute inset-0  flex items-center justify-center">
        <div className="bg-white background_popup rounded-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Get 10% Off!</h2>
          <p className="mb-4">Enter your email to receive a discount:</p>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={handleChange}
              className="p-2 mb-4 border border-gray-300 rounded"
              required
            />
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Popup;
