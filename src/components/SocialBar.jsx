import { FaTelegram, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import { MessageSquare, Sparkles } from "lucide-react";

export default function SocialBar() {
  const socialLinks = [
    { icon: <FaTelegram size={20} />, href: "https://t.me/yourtelegram", color: "from-blue-500 to-cyan-500", label: "Telegram" },
    { icon: <FaInstagram size={20} />, href: "https://instagram.com/yourid", color: "from-pink-500 to-rose-500", label: "Instagram" },
    { icon: <FaYoutube size={20} />, href: "https://youtube.com/@yourchannel", color: "from-red-500 to-orange-500", label: "YouTube" },
    { icon: <FaTwitter size={20} />, href: "https://twitter.com/yourid", color: "from-sky-500 to-blue-500", label: "Twitter" },
  ];

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
      {socialLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`group relative bg-gradient-to-br ${link.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300`}
          aria-label={link.label}
        >
          {/* Tooltip */}
          <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900/90 backdrop-blur-sm rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            {link.label}
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900/90 rotate-45" />
          </div>
          
          {/* Icon */}
          <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
            {link.icon}
          </div>
          
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>
      ))}
      
      {/* Support Button */}
      <button
        onClick={() => window.open('mailto:support@yourdomain.com')}
        className="group relative bg-gradient-to-br from-purple-600 to-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Support"
      >
        <MessageSquare className="w-5 h-5 text-white transform group-hover:scale-110 transition-transform duration-300" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-950 animate-pulse" />
      </button>
    </div>
  );
}