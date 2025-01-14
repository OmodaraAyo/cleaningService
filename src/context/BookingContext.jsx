import React, { createContext, useState } from 'react';

// Create the context
export const BookingContext = createContext();

// Create a provider component
export const BookingProvider = ({ children }) => {

  const [bookingDetails, setBookingDetails] = useState(
    {
      frequency: "",
      hours: "",
      cleaningDays: "",
      interviewCleaner: "",
      parkingAvailability: "",
      ironing: "",
      pet: [
        ""
      ],
      houseAccess: "",
      comments: "",
      referrer: "",
      title: "",
      firstName: "",
      lastName: "",
      company: "",
      street: "",
      town: "",
      postalCode: "",
      mobileNumber: "",
      landline: "",
      emailAddress: "",
      contactMethod: ""
    }
  )

  // State to track the active step
  const [activeStep, setActiveStep] = useState(1);
  //state to share agency fee across the page
  const [agencyFee, setAgencyFee] = useState(null);

  return (
    <BookingContext.Provider value={{ bookingDetails, setBookingDetails, activeStep, setActiveStep, agencyFee, setAgencyFee }}>
      {children}
    </BookingContext.Provider>
  );
};