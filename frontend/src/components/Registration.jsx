import React, { useEffect, useState } from "react";
import { BiUpload } from "react-icons/bi";
import { RxCrossCircled } from "react-icons/rx";
import Dropdown from "./DropDown";
import Swal from "sweetalert2";

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
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== "";

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
                }}
                id={id}
                className={`bg-transparent outline-none border-b pt-4 py-1 text-base w-full ${
                    error ? "border-red-500" : "border-black"
                }`}
                autoComplete="off"
                value={value}
            ></input>
            <label
                htmlFor={id}
                className={`absolute transition-all ${
                    (isFocused || hasValue)
                        ? "text-black text-sm top-2 left-4"
                        : "text-gray-500 text-base top-7 left-4"
                }`}
            >
                {label}
            </label>
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
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
    
    const [errors, setErrors] = useState({});

    const validatePhone = (phone) => {
        const pattern = /^[5-9]\d{9}$/;
        return pattern.test(phone);
    };

    const validateEmail = (email) => {
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return pattern.test(email);
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

    const validateForm = () => {
        const newErrors = {};
        
        // Name validation
        if (!name.trim()) {
            newErrors.name = "Name is required";
        } else if (name.length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }
        
        // Email validation
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(email)) {
            newErrors.email = "Please enter a valid email";
        }
        
        // Phone validation
        if (!phone) {
            newErrors.phone = "Phone number is required";
        } else if (!validatePhone(phone)) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }
        
        // College validation
        if (!college.trim()) {
            newErrors.college = "College name is required";
        }
        
        // Year validation
        if (!year.trim()) {
            newErrors.year = "Year of study is required";
        }
        
        // Branch validation
        if (!branch.trim()) {
            newErrors.branch = "Branch is required";
        }
        
        // Transaction ID validation
        if (!transaction.trim()) {
            newErrors.transaction = "Transaction ID is required";
        }
        
        // Dual boot validation
        if (isDualBooted !== "Yes" && isDualBooted !== "No") {
            newErrors.isDualBooted = "Please select an option";
        }
        
        // File validation
        if (!file) {
            newErrors.file = "Payment screenshot is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const register = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
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
        
        try {
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
            
            const res = await fetch(
                "https://linux-diary-6-0.onrender.com/registration",
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
            } else {
                throw new Error(data.message || "Registration failed");
            }
        } catch (err) {
            Swal.close();
            showAlert("error", "Failed to register", "Please try again later, Contact: 9579047160");
        }

        setIsLoading(false);
    };

    return (
        <div
            id="register"
            className="px-6 md:px-14 py-24 relative flex items-center justify-center"
        >
            <div className="bg-white/35 backdrop-blur-2xl shadow-md rounded-lg flex flex-col-reverse md:flex-row md:space-x-4 justify-center items-center z-50 w-full min-h-72">
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
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) {
                                    setErrors(prev => ({ ...prev, name: "" }));
                                }
                            }}
                            value={name}
                            error={errors.name}
                        />
                        <Input
                            label="Email"
                            type="email"
                            required={true}
                            id="email"
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) {
                                    setErrors(prev => ({ ...prev, email: "" }));
                                }
                            }}
                            value={email}
                            error={errors.email}
                        />
                        <Input
                            label={"Phone No."}
                            type={"tel"}
                            pattern={"[5-9]{1}[0-9]{9}"}
                            required={true}
                            maxLength={10}
                            id={"phone"}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                if (errors.phone) {
                                    setErrors(prev => ({ ...prev, phone: "" }));
                                }
                            }}
                            value={phone}
                            error={errors.phone}
                        />
                        <Input
                            label={"College Name"}
                            type={"text"}
                            required={true}
                            id={"college"}
                            onChange={(e) => {
                                setCollege(e.target.value);
                                if (errors.college) {
                                    setErrors(prev => ({ ...prev, college: "" }));
                                }
                            }}
                            value={college}
                            error={errors.college}
                        />
                        <Input
                            label={"Year of Study"}
                            type={"text"}
                            required={true}
                            id={"year"}
                            onChange={(e) => {
                                setYear(e.target.value);
                                if (errors.year) {
                                    setErrors(prev => ({ ...prev, year: "" }));
                                }
                            }}
                            value={year}
                            error={errors.year}
                        />
                        <Input
                            label={"Branch"}
                            type={"text"}
                            required={true}
                            id={"branch"}
                            onChange={(e) => {
                                setBranch(e.target.value);
                                if (errors.branch) {
                                    setErrors(prev => ({ ...prev, branch: "" }));
                                }
                            }}
                            value={branch}
                            error={errors.branch}
                        />
                        
                        <div>
                            <Dropdown
                                selectedItem={isDualBooted}
                                options={["Yes", "No"]}
                                handleItemClick={(item) => {
                                    setIsDualBooted(item);
                                    if (errors.isDualBooted) {
                                        setErrors(prev => ({ ...prev, isDualBooted: "" }));
                                    }
                                }}
                                label={"Do you have Linux installed?"}
                            />
                            {errors.isDualBooted && (
                                <p className="text-red-500 text-xs mt-1 ml-4">
                                    {errors.isDualBooted}
                                </p>
                            )}
                        </div>
                        
                        <Input
                            label={"Referral Code"}
                            type={"text"}
                            id={"referral"}
                            onChange={(e) => setReferral(e.target.value)}
                            value={referral}
                        />

                        <Input
                            label={"UPI transaction ID"}
                            type={"text"}
                            required={true}
                            id={"transaction"}
                            onChange={(e) => {
                                setTransaction(e.target.value);
                                if (errors.transaction) {
                                    setErrors(prev => ({ ...prev, transaction: "" }));
                                }
                            }}
                            value={transaction}
                            error={errors.transaction}
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
                                        onChange={(e) => {
                                            setFile(e.target.files[0]);
                                            if (errors.file) {
                                                setErrors(prev => ({ ...prev, file: "" }));
                                            }
                                        }}
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
                            {errors.file && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.file}
                                </p>
                            )}
                        </div>
                        <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
                            <button
                                className="text-white rounded-lg w-full sm:w-fit px-12 bg-cyan-500 py-3 text-xl font-semibold shadow-xl cursor-pointer hover:bg-cyan-600 hover:scale-105 transition-all min-w-48"
                                type="submit"
                                onClick={register}
                                disabled={isLoading}
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
                    <img src={imgQr} className="lg:w-[80%] w-full " alt="QR Code"></img>
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
                                    onChange={(e) => {
                                        setFile(e.target.files[0]);
                                        if (errors.file) {
                                            setErrors(prev => ({ ...prev, file: "" }));
                                        }
                                    }}
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
                        {errors.file && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.file}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;