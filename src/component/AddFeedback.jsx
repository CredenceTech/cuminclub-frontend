import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReactDOM from 'react-dom';
import LoadingAnimation from './Loader';
import toast from 'react-hot-toast';

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            className={`w-10 h-10 mt-1 focus:outline-none`}
            onClick={() => setRating(starValue)}
          >
            <svg width="24" height="24" viewBox="0 0 17 17" fill='none' xmlns="http://www.w3.org/2000/svg"> {/* Increased SVG size */}
              <path d={starValue <= rating ?
                "M8.61075 0.843694C8.5195 0.658803 8.3312 0.541748 8.12502 0.541748C7.91883 0.541748 7.73053 0.658803 7.63928 0.843694L5.42183 5.33681L0.46384 6.05679C0.25979 6.08642 0.0902597 6.22933 0.0265345 6.42543C-0.0371906 6.62152 0.0159425 6.83679 0.163592 6.98071L3.75133 10.4779L2.90415 15.4166C2.86929 15.6198 2.95283 15.8252 3.11964 15.9464C3.28644 16.0676 3.50759 16.0835 3.69009 15.9876L8.12502 13.6559L12.5599 15.9876C12.7424 16.0835 12.9636 16.0676 13.1304 15.9464C13.2972 15.8252 13.3807 15.6198 13.3459 15.4166L12.4987 10.4779L16.0864 6.98071C16.2341 6.83679 16.2872 6.62152 16.2235 6.42543C16.1598 6.22933 15.9902 6.08642 15.7862 6.05679L10.8282 5.33681L8.61075 0.843694Z"
                : "M8.87435 13.0437L4.18735 15.508L5.08268 10.2887L1.29102 6.59267L6.53085 5.83176L8.87435 1.08325L11.2178 5.83176L16.4577 6.59267L12.666 10.2887L13.5613 15.508L8.87435 13.0437Z"}
                fill={starValue <= rating ? "#EB7E01" : "none"}
                stroke={starValue > rating ? "#EB7E01" : "none"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

function generateRandomText(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const Modal = ({ children, onClose }) => {
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

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[500] flex justify-center items-center">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6">
        {children}
      </div>
    </div>,
    document.body // Render the modal to the body
  );
};

const AddFeedback = ({ productId, productName, onClose }) => {
  const randomText = generateRandomText(4);
  const [loading, setLoading] = useState(false);
  // Define validation schema using Yup
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required('First Name is required'),
    lastName: Yup.string()
      .required('Last Name is required'),
    feedback: Yup.string()
      .required('Review is required'),
    rating: Yup.number()
      .min(1, 'Rating is required')
      .max(5, 'Rating must be between 1 and 5')
      .required('Rating is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      feedback: '',
      rating: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const fields = [
        { key: "reviewer_name", value: `${values.firstName} ${values.lastName}` },
        { key: "title", value: `${productName} ${randomText}` },
        { key: "feedback", value: values.feedback },
        { key: "rating", value: JSON.stringify(values.rating) },
        { key: "is_approved", value: "false" },
      ];
      const params = {
        productId: productId,
        fields
      };

      handleReviewSubmit(params)
    },
  });
  async function handleReviewSubmit(params) {
    const url = `${import.meta.env.VITE_SHOPIFY_API_URL_LOCAL}/add-feedbacks`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      if (responseData?.success) {
        toast.success("Thank you for sharing your thoughts! Your feedback helps us serve you better, one delicious meal at a time. 🍽️");
        formik.resetForm();
        onClose();
      }

    } catch (error) {
      setLoading(false)
      console.error('Error submitting feedback:', error);
    }
  }

  return (
    <Modal onClose={onClose}>
      <div className="w-full max-w-md mx-auto">
        <div className='flex flex-row justify-between'>
          <h2 className="text-2xl font-bold mb-2 font-regola-pro">Add Review</h2>
          <button onClick={onClose} className=" text-gray-500 hover:text-gray-700 font-regola-pro">
            <svg xmlns="http://www.w3.org/2000/svg" height="25" width="25" viewBox="0 0 384 512"><path fill="#000000" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>
          </button>
        </div>
        <p className="text-gray-600 font-regola-pro">We value your opinion. Please share your feedback with us.</p>
        <form onSubmit={formik.handleSubmit} className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block mb-1 font-regola-pro">First Name</label>
              <input
                id="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur} // Add onBlur for validation
                className={`w-full px-3 py-2 border rounded-md font-regola-pro ${formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : ''} focus:outline-none`}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="text-red-500 text-sm font-regola-pro">{formik.errors.firstName}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="lastName" className="block mb-1 font-regola-pro">Last Name</label>
              <input
                id="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md font-regola-pro ${formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : ''} focus:outline-none`}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="text-red-500 text-sm font-regola-pro">{formik.errors.lastName}</div>
              ) : null}
            </div>
          </div>
          <div>
            <label htmlFor="feedback" className="block mb-1 font-regola-pro">Review</label>
            <textarea
              id="feedback"
              value={formik.values.feedback}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-3 py-2 border rounded-md font-regola-pro ${formik.touched.feedback && formik.errors.feedback ? 'border-red-500' : ''} focus:outline-none`}
              rows={4}
            />
            {formik.touched.feedback && formik.errors.feedback ? (
              <div className="text-red-500 text-sm font-regola-pro">{formik.errors.feedback}</div>
            ) : null}
          </div>
          <div>
            <label className="block mb-1 font-regola-pro">Rating</label>
            <StarRating rating={formik.values.rating} setRating={(value) => formik.setFieldValue('rating', value)} />
            {formik.touched.rating && formik.errors.rating ? (
              <div className="text-red-500 text-sm font-regola-pro">{formik.errors.rating}</div>
            ) : null}
          </div>
          <button type="submit" className="w-full bg-[#EB7E01] text-[#333333] py-2 rounded-md  transition-colors font-regola-pro">
            Submit Review
          </button>
        </form>
      </div>
      {loading && <LoadingAnimation />}
    </Modal>
  );
};

export default AddFeedback;