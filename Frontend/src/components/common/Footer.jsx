import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <div className="bg-[#1A1A1A] ">
      <footer className="w-[90%] mx-auto    p-8">
        <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 text-center md:justify-between  border-t-[#60df7b]">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-2xl md:text
            -3xl font-bold text-cyan-500 whitespace-nowrap"
            >
              Link-up
            </Link>
          </div>
          <ul className="flex flex-wrap items-center gap-y-2 gap-x-8 justify-center md:justify-between ">
            <li>
              <div
                href="#"
                color="blue-gray"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500 "
              >
                About Us
              </div>
            </li>
            <li>
              <div
                href="#"
                color="blue-gray"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
              >
                License
              </div>
            </li>
            <li>
              <div
                href="#"
                color="blue-gray"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
              >
                Contribute
              </div>
            </li>
            <li>
              <div
                href="#"
                color="blue-gray"
                className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500 f"
              >
                Contact Us
              </div>
            </li>
          </ul>
        </div>
        <hr className="my-8 border-blue-gray-50" />
        <div
          color="blue-gray"
          className="font-normal text-center  xs:flex justify-between items-center  "
        >
          <div>&copy; 2025 Link-up. All Rights Reserved.</div>

          <div className="flex gap-4 text-blue-gray-900  justify-center">
            <Link
              href="#"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <FaFacebook className="text-2xl" />
            </Link>
            <Link
              href="#"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <FaInstagram className="text-2xl" />
            </Link>
            <Link
              href="#"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <FaGithub className="text-2xl" />
            </Link>
            <Link
              href="#"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <FaXTwitter className="text-2xl" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
