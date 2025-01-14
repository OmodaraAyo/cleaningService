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

const Details = () => {
  const { bookingDetails, setBookingDetails, setActiveStep } =
    useContext(BookingContext);
  const navigate = useNavigate();

  console.log("book", bookingDetails);
  console.log(
    "cleaningDays from details page:",
    bookingDetails.cleaningDays[0]
  );

  const titleOptions = ["Mr", "Mrs", "Miss", "MS", "MX", "Dr"];
  const preferredContactOptions = ["Email", "Phone"];
  const [isManualEntry, setIsManualEntry] = useState(false);

  const { data: rawAddresses } = useQuery({
    queryKey: ["frequency"],
    queryFn: getAddress,
  });

  // Map the backend response to an array of formatted addresses
  const addressOptions =
    rawAddresses?.map((address) => address.formattedAddress) || [];

  // Update the bookingDetails context directly on change
  const handleChange = (name, value) => {
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["bookings"],
    mutationFn: bookingApi,
  });

  const [manualAddress, setManualAddress] = useState({
    company: "",
    street: "",
    town: "",
  });

  const handlemanualAddressChange = (e) => {
    const { name, value } = e.target;
    setManualAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const allFieldsFilled =
      bookingDetails.title &&
      bookingDetails.firstName &&
      bookingDetails.lastName &&
      (isManualEntry
        ? manualAddress.company && manualAddress.street && manualAddress.town
        : bookingDetails.company) &&
      bookingDetails.mobileNumber &&
      bookingDetails.landline &&
      bookingDetails.emailAddress &&
      bookingDetails.contactMethod;

    if (allFieldsFilled) {
      setBookingDetails({
        ...bookingDetails,
        company: isManualEntry ? manualAddress.company : bookingDetails.company,
        street: isManualEntry ? manualAddress.street : bookingDetails.street,
        town: isManualEntry ? manualAddress.town : bookingDetails.town,
      });
      setActiveStep(4);
      navigate("/appointment/billing");
    } else {
      alert("Please fill all fields.");
    }
  };

  return (
    <div className="details-container">
      <h4>Your Details</h4>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <SelectInput
          title="Your title"
          options={titleOptions}
          before_select="Title"
          selected={bookingDetails.title || ""}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        {/* First Name */}
        <Input
          className="col-12 mb-2"
          type="text"
          placeholder="First name"
          name="firstName"
          value={bookingDetails.firstName || ""}
          onChange={(e) => handleChange("firstName", e.target.value)}
        />

        {/* Last Name */}
        <Input
          className="col-12 mb-2"
          type="text"
          placeholder="Last name"
          name="lastName"
          value={bookingDetails.lastName || ""}
          onChange={(e) => handleChange("lastName", e.target.value)}
        />
        <div>
          {/* Conditional Rendering */}
          {!isManualEntry ? (
            <SelectInput
              title="Your address"
              options={addressOptions}
              before_select="Select address from the list"
              value={bookingDetails.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          ) : (
            <div className="mt-5">
              <label htmlFor="manualAddress" className="form-label">
                Enter your address
              </label>

              <Input
                className="col-12 mb-2"
                type="text"
                placeholder="Company"
                name="company"
                value={manualAddress.company || ""}
                onChange={handlemanualAddressChange}
              />

              <Input
                className="col-12 mb-2"
                type="text"
                placeholder="Street"
                name="street"
                value={manualAddress.street || ""}
                onChange={handlemanualAddressChange}
              />

              <Input
                className="col-12 mb-2"
                type="text"
                placeholder="Town"
                name="town"
                value={manualAddress.town || ""}
                onChange={handlemanualAddressChange}
              />

              <Input
                className="col-12 mb-2"
                type="text"
                placeholder="postcode"
                name="postcode"
                value={"AA111AA"}
                disabled={true}
              />
            </div>
          )}

          {/* Toggle Button */}
          <button
            type="button"
            className="my-4 btn btn-secondary btn-lg"
            onClick={() => setIsManualEntry(!isManualEntry)}
          >
            {isManualEntry
              ? "Select address from list"
              : "Enter address manually"}
          </button>
        </div>

        {/* Contact Information */}
        <div>
          <h6>Contact Information</h6>

          {/* Mobile Number */}
          <Input
            className="col-12 my-2"
            name="mobileNumber"
            placeholder="Mobile number"
            type="text"
            value={bookingDetails.mobileNumber || ""}
            onChange={(e) => handleChange("mobileNumber", e.target.value)}
          />

          {/* Landline */}
          <Input
            className="col-12 my-2"
            name="landline"
            placeholder="Landline number"
            type="text"
            value={bookingDetails.landline || ""}
            onChange={(e) => handleChange("landline", e.target.value)}
          />

          {/* Email Address */}
          <Input
            className="col-12 my-2"
            name="emailAddress"
            placeholder="Email address"
            type="email"
            value={bookingDetails.emailAddress || ""}
            onChange={(e) => handleChange("emailAddress", e.target.value)}
          />

          {/* Preferred Contact Method */}
          <SelectInput
            title="Preferred Contact Method"
            options={preferredContactOptions}
            before_select="Your preferred contact method"
            selected={bookingDetails.contactMethod || ""}
            onChange={(e) => handleChange("contactMethod", e.target.value)}
          />
        </div>

        {/* Terms and Conditions */}
        <div>
          <h6>Terms and Conditions</h6>
          <div>
            <span>Accept our </span>
            <Link to="/" className="underline">
              terms and conditions
            </Link>
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
            {isPending ? "Submitting..." : "Proceed to Payment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Details;
