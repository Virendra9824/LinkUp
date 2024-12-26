import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function AboutUs() {
  const { token } = useSelector((state) => state.auth);
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center p-6 text-gray-100">
      {/* Page Heading */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-100 text-center mt-10">
        What is <span className="text-cyan-500">LinkUp?</span>
      </h1>

      {/* Description Section */}
      <div className="max-w-5xl mt-8 bg-gray-800 shadow-lg rounded-lg p-6 md:p-10">
        <p className="text-lg md:text-lg text-gray-300 leading-relaxed">
          LinkUp is a social media platform built exclusively for JIET students
          and faculty. It fosters connections, idea-sharing, and opportunities
          within the JIET community through features like real-time messaging,
          post sharing, and community engagement, empowering meaningful
          interactions and growth.
        </p>
        <p className="text-lg md:text-lg text-gray-300 leading-relaxed mt-4">
          This platform has been envisioned and brought to life by{" "}
          <a
            href="https://www.linkedin.com/in/virendra9824/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer px-2 font-semibold text-cyan-500 italic animate-pulse underline"
          >
            Virendra Kumar
          </a>
          ,
          <a
            href="https://www.linkedin.com/in/vijay-kumar-9270b6239/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer px-2 font-semibold text-cyan-500 italic animate-pulse underline"
          >
            Vijay Kumar
          </a>
          , and
          <a
            href="https://www.linkedin.com/in/chirag-trivedi06/"
            target="_blank"
            rel="noopener noreferrer"
            className=" cursor-pointer px-2 font-semibold text-cyan-500 italic animate-pulse underline"
          >
            Chirag Trivedi
          </a>
          dedicated students of JIET, who designed LinkUp to cater to the needs
          of their peers and faculty.
        </p>
      </div>

      {/* Features Section */}
      <div className="mt-12 w-full max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-100 text-center mb-6">
          Why Choose LinkUp?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-gray-800 shadow-md rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-cyan-500">
              Seamless Connections
            </h3>
            <p className="text-gray-300 mt-2">
              Build meaningful relationships with like-minded people through our
              intuitive connection features.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-gray-800 shadow-md rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-cyan-500">
              Secure Messaging
            </h3>
            <p className="text-gray-300 mt-2">
              Communicate in real-time with end-to-end encryption ensuring your
              privacy and security.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-gray-800 shadow-md rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-cyan-500">
              Explore Communities
            </h3>
            <p className="text-gray-300 mt-2">
              Join or create communities that match your interests and engage
              with people worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="mt-12 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-4">
          Ready to LinkUp?
        </h2>
        <p className="text-gray-300 mb-6">
          {token
            ? "Welcome back to LinkUp! Continue connecting with your community."
            : "Sign up today and become part of the growing LinkUp community!"}
        </p>
        <Link
          to={token ? "/" : "/auth/login"}
          className="bg-cyan-500 text-gray-800 px-6 py-3 rounded-full shadow hover:bg-cyan-400 transition duration-300 font-bold"
        >
          {token ? "Explore" : "Get Started"}
        </Link>
      </div>
    </div>
  );
}
