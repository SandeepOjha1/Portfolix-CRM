import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Search,
  ShoppingBag,
  User,
  ShieldCheck,
  Send,
} from 'lucide-react';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: 'Website Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: 'Website Inquiry',
          message: '',
        });
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setError(
        err.response?.data?.message ||
        'Something went wrong. Please check your submission and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E5E7EB]/60 sm:py-12 px-4 sm:px-6 flex items-center justify-center font-sans antialiased">
      {/* Outer Card Container (Matching Image 4 rounded frame) */}
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-5xl overflow-hidden border border-slate-200/60 p-6 sm:p-10">
        {/* Navigation Bar (Matching Image 4) */}
        <header className="flex items-center justify-between pb-8 sm:pb-14 border-b border-slate-100">
          <div className="flex items-center gap-8">
            {/* Brand Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm">
                A
              </div>
              <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />
            </div>

            {/* Menu Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-700">
              <span className="cursor-pointer hover:text-black">Hero</span>
              <span className="cursor-pointer hover:text-black">About</span>
              <span className="cursor-pointer hover:text-black">Shop ▾</span>
              <span className="cursor-pointer hover:text-black">Blog</span>
            </nav>
          </div>

          {/* Right Header Navigation Icons */}
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-semibold shadow-sm">
              Contact
            </span>
            <Search className="w-4 h-4 text-slate-700 cursor-pointer hover:text-black hidden sm:block" />
            <ShoppingBag className="w-4 h-4 text-slate-700 cursor-pointer hover:text-black hidden sm:block" />
            <Link
              to="/login"
              title="Admin Dashboard Login"
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Main Content: Split layout (Matching Image 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 pt-8 sm:pt-12 items-start">
          {/* Left Column: Heading & Contact Info (Matching Image 4) */}
          <div className="lg:col-span-6 space-y-6 sm:pr-6">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Talk to our <br />
              support team
            </h1>

            <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed max-w-md">
              Feel free to reach out for help with your order or any questions you may have
              regarding your purchase.
            </p>

            <div className="pt-6 sm:pt-12 space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="font-medium">support@avenixstore.com</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-medium">123 Tech Avenue, San Francisco, USA</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="font-medium">+1 (415) 555-2671</span>
              </div>
            </div>

            {/* Admin Portal helper pill */}
            <div className="pt-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Admin? Access CRM Dashboard</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Contact Form (Matching Image 4) */}
          <div className="lg:col-span-6 bg-[#F3F4F6] p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/50">
            {success ? (
              <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Message Received!</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Thank you for contacting us. Your message has been saved in our CRM system and an
                  account representative will review it shortly.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Send Another Message
                  </button>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-white text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    View in Dashboard →
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                    {error}
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Enter Your Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-11 px-4 text-xs sm:text-sm bg-white rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder-slate-400 text-slate-800"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter Your Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-11 px-4 text-xs sm:text-sm bg-white rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder-slate-400 text-slate-800"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter Your Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full h-11 px-4 text-xs sm:text-sm bg-white rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder-slate-400 text-slate-800"
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Enter Your Company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full h-11 px-4 text-xs sm:text-sm bg-white rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder-slate-400 text-slate-800"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    required
                    placeholder="Write Your Message Here"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-4 text-xs sm:text-sm bg-white rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder-slate-400 text-slate-800 resize-none"
                  />
                </div>

                {/* Submit Button (Matching Image 4 "Send Message ->") */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-black hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-md disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

