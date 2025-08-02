import React, { useEffect, useState } from "react";
// import MainImg from "../assets/frozen-bg.jpg";
// import SnowfallEffect from "./SnowfallEffect";
// import RegisterTux from "../assets/Payement.png";
import { BiCross, BiUpload } from "react-icons/bi";
import { RxCrossCircled } from "react-icons/rx";
import Dropdown from "./DropDown";
import Swal from "sweetalert2";
import { CgSearchLoading } from "react-icons/cg";

import imgQr from "../assets/Roadmaps/Qr tux.png";

const Input = ({
    label,
    type,
    placeholder,
    onChange,
    required,
    minLength,
    maxLength,
    id,
    pattern,
    value,
    error,
    isValid,
    onBlur,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative bg-white rounded-xl p-4 text-black shadow-md">
            <input
                type={type}
                placeholder={placeholder}
                onChange={onChange}
                required={required}
                minLength={minLength}
                maxLength={maxLength}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                    if (e.target.value === "") {
                        setIsFocused(false);
                    }
                    if (onBlur) onBlur(e);
                }}
                id={id}
                className={`bg-transparent outline-none border-b pt-4 py-1 text-base w-full transition-colors ${
                    error 
                        ? "border-red-500" 
                        : isValid 
                        ? "border-green-500" 
                        : "border-black"
                }`}
                autoComplete="off"
                value={value}
            ></input>
            <label
                htmlFor={id}
                className={`absolute transition-all ${
                    isFocused
                        ? "text-black text-sm top-2 left-4"
                        : "text-gray-500 text-base top-7 left-4"
                }`}
            >
                {label}
            </label>
            {error && (
                <p className="text-red-500 text-xs mt-1 absolute -bottom-6 left-0">
                    {error}
                </p>
            )}
        </div>
    );
};

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [college, setCollege] = useState("");
    const [year, setYear] = useState("");
    const [branch, setBranch] = useState("");
    const [transaction, setTransaction] = useState("");
    const [referral, setReferral] = useState("");
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDualBooted, setIsDualBooted] = useState(
        "Do you have Linux installed?"
    );

    // Validation states
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isValid, setIsValid] = useState({});

    // Validation patterns
    const patterns = {
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        phone: /^[5-9]\d{9}$/,
        name: /^[a-zA-Z\s]{3,50}$/,
        transaction: /^[a-zA-Z0-9]{8,}$/,
        referral: /^[a-zA-Z0-9]{0,10}$/,
    };

    // Validation rules
    const validationRules = {
        name: {
            required: true,
            minLength: 3,
            maxLength: 50,
            pattern: patterns.name,
            message: "Name must be 3-50 characters long and contain only letters and spaces"
        },
        email: {
            required: true,
            pattern: patterns.email,
            message: "Please enter a valid email address"
        },
        phone: {
            required: true,
            pattern: patterns.phone,
            message: "Please enter a valid 10-digit phone number starting with 5-9"
        },
        college: {
            required: true,
            minLength: 2,
            maxLength: 100,
            message: "College name must be 2-100 characters long"
        },
        year: {
            required: true,
            minLength: 1,
            maxLength: 10,
            message: "Year of study is required"
        },
        branch: {
            required: true,
            minLength: 2,
            maxLength: 50,
            message: "Branch must be 2-50 characters long"
        },
        transaction: {
            required: true,
            pattern: patterns.transaction,
            message: "Transaction ID must be at least 8 characters long"
        },
        referral: {
            required: false,
            pattern: patterns.referral,
            message: "Referral code must be alphanumeric and up to 10 characters"
        }
    };

    // Validate individual field
    const validateField = (fieldName, value) => {
        const rules = validationRules[fieldName];
        if (!rules) return "";

        if (rules.required && (!value || value.trim() === "")) {
            return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }

        if (value && rules.minLength && value.length < rules.minLength) {
            return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${rules.minLength} characters long`;
        }

        if (value && rules.maxLength && value.length > rules.maxLength) {
            return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be no more than ${rules.maxLength} characters long`;
        }

        if (value && rules.pattern && !rules.pattern.test(value)) {
            return rules.message;
        }

        return "";
    };

    // Handle field change with validation
    const handleFieldChange = (fieldName, value, setter) => {
        setter(value);
        
        if (touched[fieldName]) {
            const error = validateField(fieldName, value);
            setErrors(prev => ({ ...prev, [fieldName]: error }));
            setIsValid(prev => ({ ...prev, [fieldName]: !error }));
        }
    };

    // Handle field blur
    const handleFieldBlur = (fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        const value = getFieldValue(fieldName);
        const error = validateField(fieldName, value);
        setErrors(prev => ({ ...prev, [fieldName]: error }));
        setIsValid(prev => ({ ...prev, [fieldName]: !error }));
    };

    // Get field value by name
    const getFieldValue = (fieldName) => {
        const fieldMap = {
            name, email, phone, college, year, branch, transaction, referral
        };
        return fieldMap[fieldName] || "";
    };

    // Validate all fields
    const validateAllFields = () => {
        const newErrors = {};
        const newIsValid = {};
        let isValid = true;

        Object.keys(validationRules).forEach(fieldName => {
            const value = getFieldValue(fieldName);
            const error = validateField(fieldName, value);
            newErrors[fieldName] = error;
            newIsValid[fieldName] = !error;
            if (error) isValid = false;
        });

        setErrors(newErrors);
        setIsValid(newIsValid);
        setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

        return isValid;
    };

    // Check if form is valid
    const isFormValid = () => {
        const hasErrors = Object.values(errors).some(error => error !== "");
        const hasRequiredFields = Object.keys(validationRules).every(fieldName => {
            const rules = validationRules[fieldName];
            const value = getFieldValue(fieldName);
            return !rules.required || (value && value.trim() !== "");
        });
        return !hasErrors && hasRequiredFields && isDualBooted !== "Do you have Linux installed?" && file !== null;
    };

    const showAlert = (icon, title, text) => {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            background: "white",
            confirmButtonColor: icon === "error" ? "#f97316" : "#78eb91",
        });
    };

    const register = async (e) => {
        e.preventDefault();

        if (!validateAllFields()) {
            showAlert("error", "Validation Error", "Please fix the errors in the form");
            return;
        }

        if (isDualBooted !== "Yes" && isDualBooted !== "No") {
            showAlert(
                "error",
                "Invalid Input",
                "Please select if you have linux installed"
            );
            return;
        }

        if (file === null) {
            showAlert(
                "error",
                "Invalid Input",
                "Please upload payment screenshot"
            );
            return;
        }

        setIsLoading(true);
        Swal.fire({
            showConfirmButton: false,
            background: "white",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            html: `
            <div class="flex flex-col items-center justify-center space-y-3">
                  <svg class="mr-3 h-10 w-10 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
                <p class="text-gray-800 text-lg font-semibold">Please wait...</p>
                </div>`,
        });
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("transactionId", transaction);
        formData.append("collegeName", college);
        formData.append("yearOfStudy", year);
        formData.append("branch", branch);
        formData.append("isDualBooted", isDualBooted === "Yes");
        formData.append("referralCode", referral);
        formData.append("paymentImg", file);
        try {
            const res = await fetch(
                "https://linux-diary-6-0.onrender.com/user/registration",
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await res.json();
            if (data.success) {
                Swal.close();
                showAlert(
                    "success",
                    "Registered Successfully",
                    "See you at the event!"
                );
                // Reset form
                setName("");
                setEmail("");
                setPhone("");
                setCollege("");
                setYear("");
                setBranch("");
                setTransaction("");
                setReferral("");
                setFile(null);
                setIsDualBooted("Do you have Linux installed?");
                setErrors({});
                setIsValid({});
                setTouched({});
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            Swal.close();
            showAlert("error", "Failed to register", "Please try again later");
        }

        setIsLoading(false);
    };

    return (
        <div
            id="register"
            className="px-6 md:px-14 py-24 relative flex items-center justify-center"
        >
            <div className="bg-white shadow-md rounded-lg flex flex-col-reverse md:flex-row md:space-x-4 justify-center items-center z-50 w-full min-h-72"
          
            >
                <div className="w-full p-6 h-full">
                    <h1 className="text-4xl font-[900] text-black hidden md:block">
                        Register!
                    </h1>
                    <p className="my-2 mb-4 text-sm sm:text-base text-black hidden md:block">
                        Fill the details below to secure your seat.
                    </p>
                    <form className="flex flex-col space-y-6 md:p-4">
                        <Input
                            label="Name"
                            type="text"
                            required={true}
                            minLength={3}
                            maxLength={50}
                            id="name"
                            onChange={(e) => handleFieldChange("name", e.target.value, setName)}
                            onBlur={() => handleFieldBlur("name")}
                            value={name}
                            error={errors.name}
                            isValid={isValid.name}
                        />
                        <Input
                            label="Email"
                            type="email"
                            required={true}
                            id="email"
                            onChange={(e) => handleFieldChange("email", e.target.value, setEmail)}
                            onBlur={() => handleFieldBlur("email")}
                            value={email}
                            error={errors.email}
                            isValid={isValid.email}
                        />
                        <Input
                            label={"Phone No."}
                            type={"tel"}
                            pattern={"[5-9]{1}[0-9]{9}"}
                            required={true}
                            maxLength={10}
                            id={"phone"}
                            onChange={(e) => handleFieldChange("phone", e.target.value, setPhone)}
                            onBlur={() => handleFieldBlur("phone")}
                            value={phone}
                            error={errors.phone}
                            isValid={isValid.phone}
                        />
                        <Input
                            label={"College Name"}
                            type={"text"}
                            required={true}
                            id={"college"}
                            onChange={(e) => handleFieldChange("college", e.target.value, setCollege)}
                            onBlur={() => handleFieldBlur("college")}
                            value={college}
                            error={errors.college}
                            isValid={isValid.college}
                        />
                        <Input
                            label={"Year of Study"}
                            type={"text"}
                            required={true}
                            id={"year"}
                            onChange={(e) => handleFieldChange("year", e.target.value, setYear)}
                            onBlur={() => handleFieldBlur("year")}
                            value={year}
                            error={errors.year}
                            isValid={isValid.year}
                        />
                        <Input
                            label={"Branch"}
                            type={"text"}
                            required={true}
                            id={"branch"}
                            onChange={(e) => handleFieldChange("branch", e.target.value, setBranch)}
                            onBlur={() => handleFieldBlur("branch")}
                            value={branch}
                            error={errors.branch}
                            isValid={isValid.branch}
                        />
                        <Dropdown
                            selectedItem={isDualBooted}
                            options={["Yes", "No"]}
                            handleItemClick={(item) => setIsDualBooted(item)}
                            label={"Do you have Linux installed?"}
                        />
                        <Input
                            label={"Referral Code"}
                            type={"text"}
                            id={"referral"}
                            onChange={(e) => handleFieldChange("referral", e.target.value, setReferral)}
                            onBlur={() => handleFieldBlur("referral")}
                            value={referral}
                            error={errors.referral}
                            isValid={isValid.referral}
                        />

                        <Input
                            label={"UPI transaction ID"}
                            type={"text"}
                            required={true}
                            id={"transaction"}
                            onChange={(e) => handleFieldChange("transaction", e.target.value, setTransaction)}
                            onBlur={() => handleFieldBlur("transaction")}
                            value={transaction}
                            error={errors.transaction}
                            isValid={isValid.transaction}
                        />
                        <div
                            className="bg-white w-full cursor-pointer shadow-lg rounded-xl p-4 flex-col space-y-2 items-center justify-center flex md:hidden"
                            onClick={() =>
                                document
                                    .getElementById("paymentImgUpload")
                                    .click()
                            }
                        >
                            {!file ? (
                                <>
                                    <BiUpload className="text-4xl font-bold text-black" />
                                    <p className="text-sm text-black">
                                        Upload Payment Screenshot
                                    </p>{" "}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setFile(e.target.files[0])
                                        }
                                        id="paymentImgUpload"
                                    ></input>
                                </>
                            ) : (
                                <>
                                    <div className="flex text-black justify-between w-full p-2 text-lg">
                                        <p>{file.name}</p>
                                        <RxCrossCircled
                                            className="text-black text-3xl ml-2"
                                            onClick={() => setFile(null)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
                            <button
                                className={`text-white rounded-lg w-full sm:w-fit px-12 py-3 text-xl font-semibold shadow-xl cursor-pointer transition-all min-w-48 ${
                                    isFormValid() 
                                        ? "bg-cyan-500 hover:bg-cyan-600 hover:scale-105" 
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                                type="submit"
                                onClick={register}
                                disabled={!isFormValid() || isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-6 h-6 border-2 border-t-2 border-white rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    "Register"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="w-full flex flex-col space-y-2 justify-center items-center p-4 md:p-24 mb:p-48">
                    <h1 className="text-4xl font-[900] text-black block md:hidden text-left w-full">
                        Register!
                    </h1>
                    <p className="my-2 mb-4 text-sm sm:text-base text-black block md:hidden text-left w-full">
                        Fill the details below to secure your seat.
                    </p>
                    <img src={imgQr} className="lg:w-[80%] w-full "></img>
                    <div
                        className="bg-white w-full cursor-pointer shadow-lg rounded-xl p-4 flex-col space-y-2 items-center justify-center hidden md:flex"
                        onClick={() =>
                            document.getElementById("paymentImgUpload").click()
                        }
                    >
                        {!file ? (
                            <>
                                <BiUpload className="text-4xl font-bold text-black" />
                                <p className="text-sm text-black">
                                    Upload Payment Screenshot
                                </p>{" "}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    id="paymentImgUpload"
                                ></input>
                            </>
                        ) : (
                            <>
                                <div className="flex text-black justify-between w-full p-2 text-lg">
                                    <p>{file.name}</p>
                                    <RxCrossCircled
                                        className="text-black text-3xl ml-2"
                                        onClick={() => setFile(null)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;