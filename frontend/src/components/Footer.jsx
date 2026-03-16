import React, { useState } from "react";
import toast from "react-hot-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNewsletterSubscribe = async (e) => {
    e.preventDefault();
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return toast.error("Please enter a valid email address");
    }
    setIsLoading(true);
    try {
      toast.success("Thanks for subscribing!");
      setEmail("");
    } catch (err) {
      toast.error("Failed to subscribe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">E-COM</h3>
          <p className="text-gray-400 text-sm">
            The best place to buy everything you need at the best prices.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Support</h4>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Shipping
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Returns
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Newsletter</h4>
          <form onSubmit={handleNewsletterSubscribe} className="flex items-center">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800 border-none rounded-l-md px-4 py-2 text-sm focus:ring-0 w-full text-white placeholder-gray-500"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 px-4 py-2 rounded-r-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "..." : "Join"}
            </button>
          </form>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} E-COM. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
