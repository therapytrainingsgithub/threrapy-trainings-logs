"use client";
import React, { useState } from "react";
import { login } from "./action";
import { useRouter } from "next/navigation";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);

      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <main className="relative py-5 px-10 font-chesna space-y-10">
      {/* header */}
      <div className="flex justify-center">
        <img src="./images/logo.png" alt="logo" />
      </div>

      {/* form */}
      <div
        className="relative py-8 px-5 rounded-xl flex flex-col items-center space-y-10"
        style={{
          background: "linear-gradient(330deg, #709D50 0%, #FCFEF2 100%)",
          border: "1px solid #dcdcdc",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden", // Ensure the image doesn't overflow
        }}
      >
        {/* Background Image */}
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden z-0">
          <img
            src="./images/bg.png"
            alt="wave background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-[#709D50] text-[41px]">Clinical Supervision Tracker</h1>
          <div className="w-full">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center space-y-6"
            >
              <div className="flex flex-col space-y-1 w-[50%]">
                <label htmlFor="email">Email</label>
                <input
                  className="rounded-md px-5 py-2"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="username@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col space-y-1 w-[50%]">
                <label htmlFor="password">Password</label>
                <input
                  className="rounded-md px-5 py-2"
                  placeholder="****************"
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="w-[50%]">
                <button
                  type="submit"
                  style={{
                    background: "#8cbf68",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  className="px-5 py-2 rounded-md text-white w-full"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="flex justify-between">
        <div>Copyright © 2024 TherapyTraining. All rights reserved.</div>
        <div className="flex space-x-5">
          <div>Terms</div>
          <div>Privacy</div>
        </div>
      </div>
    </main>
  );
};

export default Page;
