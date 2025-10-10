"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Bot } from "lucide-react";
import Chat from "./ChatBox";

export default function ContactButton() {
  const [openChat, setOpenChat] = useState(false);

  return (
    <>
      <div className="fixed bottom-24 right-6 flex flex-col items-end gap-3 z-50">
        <motion.a
          href="tel:+84123456789"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition"
        >
          <Phone className="w-6 h-6" />
        </motion.a>

        <motion.a
          href="https://m.me/minh.khoa.0905"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.a>

        {/* Nút chatbot */}
        <motion.button
          onClick={() => setOpenChat(!openChat)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-14 h-14 rounded-full shadow-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white"
        >
          <Bot className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Hộp chat */}
      <Chat open={openChat} setOpen={setOpenChat} />
    </>
  );
}
