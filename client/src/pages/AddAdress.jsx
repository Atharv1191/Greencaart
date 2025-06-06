
import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

// Reusable input field component
const InputField = ({ type, placeholder, name, handleChange, value }) => {
  return (
    <input
      className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition'
      type={type}
      placeholder={placeholder}
      name={name} // Add this line to make sure the input is tied to the state
      onChange={handleChange} // Ensure the handleChange updates the state
      value={value} // Bind value here to the address object property
      required
    />
  );
};

const AddAddress = () => {
  const { user, navigate } = useAppContext();

  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress(prevAddress => ({
      ...prevAddress,
      [name]: value
    }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post('/api/address/add', { userId: user._id, address });
      if (data.success) {
        toast.success(data.message);
        navigate('/cart');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/cart');
    }
  }, [user, navigate]);

  return (
    <div className='mt-16 pb-16'>
      <p className='text-2xl md:text-3xl text-gray-500'>
        Add Shipping <span className='font-semibold text-primary'>Address</span>
      </p>
      <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
        <div className='flex-1 max-w-md'>
          <form className='space-y-3 mt-6 text-sm' onSubmit={onSubmitHandler}>
            <InputField
              handleChange={handleChange}
              value={address.firstName}
              name="firstName"
              type="text"
              placeholder="First Name"
            />
            <InputField
              handleChange={handleChange}
              value={address.lastName}
              name="lastName"
              type="text"
              placeholder="Last Name"
            />
            <InputField
              handleChange={handleChange}
              value={address.email}
              name="email"
              type="email" // Make sure this is an email input field
              placeholder="Email"
            />
            <InputField
              handleChange={handleChange}
              value={address.street}
              name="street"
              type="text"
              placeholder="Street"
            />
            <div className='grid grid-cols-2 gap-4'>
              <InputField
                handleChange={handleChange}
                value={address.city}
                name="city"
                type="text"
                placeholder="City"
              />
              <InputField
                handleChange={handleChange}
                value={address.state}
                name="state"
                type="text"
                placeholder="State"
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <InputField
                handleChange={handleChange}
                value={address.zipcode}
                name="zipcode"
                type="text" // Changed to text to allow leading 0s in zipcodes
                placeholder="Zipcode"
              />
              <InputField
                handleChange={handleChange}
                value={address.country}
                name="country"
                type="text"
                placeholder="Country"
              />
            </div>
            <InputField
              handleChange={handleChange}
              value={address.phone}
              name="phone"
              type="text"
              placeholder="Phone"
            />
            <button
              type="submit"
              className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase'
            >
              Save Address
            </button>
          </form>
        </div>
        <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt="add address" />
      </div>
    </div>
  );
};

export default AddAddress;
