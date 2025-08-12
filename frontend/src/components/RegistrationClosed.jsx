import React, { useEffect, useState } from "react";

const RegistrationClosed = () => {
    

    return (
        <div
            id="register"
            className="px-6 md:px-14 py-24 relative flex items-center justify-center"
        >
            <div className="bg-white/35 backdrop-blur-2xl shadow-md rounded-lg flex flex-col-reverse md:flex-row md:space-x-4 justify-center items-center z-50 w-full min-h-72">
              <div className="w-full p-6 h-full">
                    <h1 className="text-4xl md:text-5xl font-[900] text-black text-center">
                        Registrations are closed!
                    </h1>
                    <p className="my-2 mb-4 text-xl md:text-2xl text-black text-center">
                        Stay tuned for more events.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationClosed;