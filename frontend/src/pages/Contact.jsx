import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { getInTouch } from "../redux/Slices/statsSlice";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // For handling tables in jsPDF

const Contact = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const userData = useSelector((state) => state?.auth?.data);

  const [data, setData] = useState({
    name: "",
    email: "",
    message: ""
  });

  useEffect(() => {
    if (isLoggedIn && userData) {
      setData((prevData) => ({
        ...prevData,
        name: userData?.fullName,
        email: userData?.email
      }));
    }
  }, [isLoggedIn, userData]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    })
  }

  const onFormSubmit = async (e) => {
    e.preventDefault();
  
    if (!data.name || !data.email || !data.message) {
      toast("Please enter all fields");
      return;
    }
  
    // Generate the PDF and convert it to base64
    const pdfBlob = await generatePDF();
    const reader = new FileReader();
    reader.readAsDataURL(pdfBlob);
    reader.onloadend = async () => {
      const base64data = reader.result;
  
      // Create the payload object
      const payload = {
        name: data.name,
        email: data.email,
        message: data.message,
        pdf: base64data, // Send the PDF as base64 string
      };
  
      // Dispatch action to send data to the server
      const res = await dispatch(getInTouch(payload));
      if (res?.payload?.success) {
        setData({
          ...data,
          message: ""
        });
      }
    };
  };
  
  
  
  const generatePDF = async () => {
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(20);
    doc.text('Review By User', 14, 20);
  
    // Set up the table
    const tableColumn = ['SL No.', 'Full Name', 'Email', 'Message'];
    const tableRows = [[1, data.name || 'N/A', data.email || 'N/A', data.message || 'N/A']];
  
    // Add the table to the PDF
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
    });
  
    // Return the PDF as a Blob
    return doc.output('blob');
  };
  

  return (
    <Layout>
      <div className="min-h-[80vh] px-10 text-white">
        {/* Page Title */}
        <h1 className="text-center text-4xl font-semibold mb-10">
          Get in <span className="text-yellow-500">Touch</span>
        </h1>

        {/* Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact Information */}
          <div className="space-y-8 bg-zinc-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-500">Contact Info</h2>
            <p>
              <span className="font-bold text-yellow-500">Address:</span> 123 Tech Street, Innovation City, India
            </p>
            <p>
              <span className="font-bold text-yellow-500">Phone:</span> +1 (123) 456-7890
            </p>
            <p>
              <span className="font-bold text-yellow-500">Email:</span> contact@example.com
            </p>
          </div>

          {/* Contact Form */}
          <div className="bg-zinc-800 p-8 rounded-lg shadow-lg">
            <form className="space-y-6" onSubmit={onFormSubmit}>
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-3 mt-2 rounded-md bg-zinc-700 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  placeholder="Your name"
                  value={data.name}
                  onChange={handleOnChange}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 mt-2 rounded-md bg-zinc-700 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  placeholder="Your email"
                  value={data.email}
                  onChange={handleOnChange}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  className="w-full p-3 mt-2 rounded-md bg-zinc-700 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  placeholder="Your message"
                  value={data.message}
                  onChange={handleOnChange}
                ></textarea>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-yellow-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
