"use client";
import { useState } from "react";
import ChatBox from "./ChatBox";
import ContactButton from "./ContactButton";

export default function ChatWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ChatBox open={open} setOpen={setOpen} />
      <ContactButton />
    </>
  );
}
