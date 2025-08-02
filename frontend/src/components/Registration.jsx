import React, { useEffect, useState } from "react";
import MainImg from "../assets/frozen-bg.jpg";
// import SnowfallEffect from "./SnowfallEffect";
import RegisterTux from "../assets/Payement.png";
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
                }}
                id={id}
                className=" bg-transparent outline-none border-b pt-4 py-1 text-base border-black w-full"
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

    const validatePhone = (phone) => {
        const pattern = /^[5-9]\d{9}$/;
        return pattern.test(phone);
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
    const isValidInput = () => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (name.length < 1) {
            showAlert("error", "Invalid Name", "Name is required");
            return false;
        }
        if (email.length === 0 || emailPattern.test(email) === false) {
            showAlert("error", "Invalid Email", "Email is required");
            return false;
        }
        if (!validatePhone(phone)) {
            showAlert(
                "error",
                "Invalid Phone Number",
                "Phone number is invalid"
            );
            return false;
        }
        if (college.length === 0) {
            showAlert("error", "Invalid College", "College name is required");
            return false;
        }
        if (year.length === 0) {
            showAlert("error", "Invalid Year", "Year of study is required");
            return false;
        }
        if (branch.length === 0) {
            showAlert("error", "Invalid Branch", "Branch is required");
            return false;
        }
        if (transaction.length === 0) {
            showAlert(
                "error",
                "Invalid Transaction ID",
                "Transaction ID is required"
            );
            return false;
        }
        if (isDualBooted !== "Yes" && isDualBooted !== "No") {
            showAlert(
                "error",
                "Invalid Input",
                "Please select if you have linux installed"
            );
            return;
        }
        return true;
    };
    const register = async (e) => {
        e.preventDefault();

            if (!isValidInput()) {
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
                    setName("");
                    setEmail("");
                    setPhone("");
                    setCollege("");
                    setYear("");
                    setBranch("");
                    setTransaction("");
                    setReferral("");
                    setFile(null);
                    setIsDualBooted("Do you have linux installed?");
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                Swal.close();
                showAlert("error", "Failed to register", "Please try again later");
            }

            setIsLoading(false);
        // Swal.fire({
        //     icon: "info",
        //     title: "Registrations are closed",
        //     text: "Stay tuned for more events!",
        //     background: "white",
        //     confirmButtonColor: "#40b1ed",
        // });
    };

    return (
        <div
            id="register"
            className="px-6 md:px-14 py-24 relative flex items-center justify-center"
        >
            <div className="bg-white/35 backdrop-blur-2xl  shadow-md rounded-lg flex flex-col-reverse md:flex-row md:space-x-4 justify-center items-center z-50 w-full min-h-72"
          
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
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                        <Input
                            label="Email"
                            type="email"
                            required={true}
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <Input
                            label={"Phone No."}
                            type={"tel"}
                            pattern={"[5-9]{1}[0-9]{9}"}
                            required={true}
                            maxLength={10}
                            id={"phone"}
                            onChange={(e) => setPhone(e.target.value)}
                            value={phone}
                        />
                        <Input
                            label={"College Name"}
                            type={"text"}
                            required={true}
                            id={"college"}
                            onChange={(e) => setCollege(e.target.value)}
                            value={college}
                        />
                        <Input
                            label={"Year of Study"}
                            type={"text"}
                            required={true}
                            id={"year"}
                            onChange={(e) => setYear(e.target.value)}
                            value={year}
                        />
                        <Input
                            label={"Branch"}
                            type={"text"}
                            required={true}
                            id={"branch"}
                            onChange={(e) => setBranch(e.target.value)}
                            value={branch}
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
                            onChange={(e) => setReferral(e.target.value)}
                            value={referral}
                        />

                        <Input
                            label={"UPI transaction ID"}
                            type={"text"}
                            required={true}
                            id={"transaction"}
                            onChange={(e) => setTransaction(e.target.value)}
                            value={transaction}
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
                                className=" text-white rounded-lg w-full sm:w-fit px-12 bg-cyan-500 py-3 text-xl font-semibold shadow-xl cursor-pointer hover:bg-cyan-600 hover:scale-105 transition-all min-w-48"
                                type="submit"
                                onClick={register}
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
                {/* <div className="w-full p-6 h-full">
                    <h1 className="text-4xl md:text-5xl font-[900] text-black text-center">
                        Registrations are closed!
                    </h1>
                    <p className="my-2 mb-4 text-xl md:text-2xl text-black text-center">
                        Stay tuned for more events.
                    </p>
                </div> */}
            </div>
        </div>
    );
};

export default Register;
