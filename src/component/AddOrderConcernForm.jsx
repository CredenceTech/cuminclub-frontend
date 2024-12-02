import React from 'react';
import ReactDOM from 'react-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import LoadingAnimation from './Loader';

const AddOrderConcernForm = ({ orderId, onClose }) => {
  const [loading, setLoading] = React.useState(false);
  const modalRef = React.useRef();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validationSchema = Yup.object({
    concernMessage: Yup.string()
      .required('Please provide a concern message to help us understand your issue.')
      .min(10, 'The concern message must be at least 10 characters long.'),
  });

  const formik = useFormik({
    initialValues: {
      concernMessage: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const fields = [
        {
          key: 'order_number',
          value: orderId,
        },
        {
          key: 'concern_message',
          value: values.concernMessage,
        },
      ];
      const params = { fields };

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SHOPIFY_API_URL_LOCAL}/order-concerns`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        if (responseData?.success) {
          toast.success('Thank you for sharing your concern! We will get back to you soon.');
          formik.resetForm();
          onClose();
        }
      } catch (error) {
        console.error('Error submitting concern:', error);
        toast.error('Something went wrong. Please try again later.');
      } finally {
        setLoading(false);
      }
    },
  });

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[500] flex justify-center items-center">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl font-bold mb-2 font-regola-pro">Have Any Concern?</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✖
          </button>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-4 mt-6">
          <div>
            <label htmlFor="concernMessage" className="text-gray-600 font-regola-pro">
              Please provide details about your concern so we can assist you promptly.<span className="text-red-500">*</span>
            </label>
            <textarea
              id="concernMessage"
              name="concernMessage"
              value={formik.values.concernMessage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border rounded-md font-regola-pro ${
                formik.touched.concernMessage && formik.errors.concernMessage
                  ? 'border-red-500'
                  : ''
              } focus:outline-none`}
              rows={4}
              placeholder="Describe your concern here..."
            />
            {formik.touched.concernMessage && formik.errors.concernMessage && (
              <div className="text-red-500 text-sm font-regola-pro">
                {formik.errors.concernMessage}
              </div>
            )}
          </div>
          <button type="submit" className="w-full bg-[#EB7E01] text-[#333333] py-2 rounded-md  transition-colors font-regola-pro">
            Submit
          </button>
        </form>
      </div>
      {loading && <LoadingAnimation />}
    </div>,
    document.body
    
  );
};

export default AddOrderConcernForm;
