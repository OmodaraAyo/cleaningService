import React, { useContext, useState } from "react";
import "../appointment.css";
import SelectInput from "../components/Select";
import Input from "../components/Input";
import { BookingContext } from "../../../context/BookingContext";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { bookingApi, getAddress } from "../../../../apis/contact";
import toast from "react-hot-toast";
import ButtonGroup from "../components/Button";

const BillingSummary = () => {
  const {bookingDetails, setActiveStep, agencyFee } = useContext(BookingContext);
  console.log("from billingSummary:", bookingDetails)
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["bookings"],
    mutationFn: bookingApi,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      frequency: bookingDetails.frequency,
      hours: bookingDetails.hours,
      date: bookingDetails.date,
      cleaningDays: bookingDetails.cleaningDays[0],
      interviewCleaner: bookingDetails.meetCleanerFirst,
      parkingAvailability: bookingDetails.parkingAvailable,
      ironing: bookingDetails.ironing,
      pet: bookingDetails.pet,
      houseAccess: bookingDetails.accessProperty,
      comments: bookingDetails.comment,
      referrer: bookingDetails.referral,
      title: bookingDetails.title,
      firstName: bookingDetails.firstName,
      lastName: bookingDetails.lastName,
      company: bookingDetails.company,
      street: bookingDetails.street,
      town: bookingDetails.town,
      postalCode:"NW95BZ",
      mobileNumber: bookingDetails.mobileNumber,
      landline: bookingDetails.landline,
      emailAddress: bookingDetails.emailAddress,
      contactMethod: bookingDetails.contactMethod,
    }
    try{
      const response = await mutateAsync(payload)
      toast.success(response.message || 'Booking confrimed successfully')
      setActiveStep(5);
      navigate("/appointment/complete");
    }catch(error){
      toast.error(error.message || 'An error occured while confirming the booking.')
    }
  };

  const checkIfAgencyFee = () => {
    return agencyFee == null? '': `$${agencyFee}`;
  }

  return (
    <div className="details-container">
      <h4 className="mt-3 mb-4">Enter your card details to pay</h4>
      <form onSubmit={handleSubmit}>
        {/* Card Number */}
        <h6 className="mb-2">Card Number</h6>
        <Input
          title="cards number"
          placeholder={"0000 0000 0000 0000"}
          maxLength={'16'}
        
        />
        <div>
          <div className="mb-4">
            <h6 className="mt-3 mb-2">Card Expiry</h6>
            <Input
              type={"text"}
              id={"expiryDate"}
              name={"expiryDate"}
              placeholder={"MM/YYYY"}
              maxLength={"7"}
            />
          </div>
          <div>
            <h6 className="mt-3 mb-2">CVV</h6>
            <Input
              type={"text"}
              id={"expiryDate"}
              name={"expiryDate"}
              placeholder={"123"}
              maxLength={"3"}
            />
          </div>
        </div>
        {/* Submit Button */}
        <div className="my-5">
          <button
            type="submit"
            style={{ fontSize: "18px" }}
            className="btn btn-primary btn-lg px-5 border-radius-1 border-none bg-primary text-white"
            disabled={isPending}
          >
            {isPending ? "Processing Payment..." : `Pay ${checkIfAgencyFee()}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillingSummary;
