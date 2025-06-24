"use client";
import { motion } from "motion/react";

import { title, subtitle } from "@/components/primitives";

export default function AboutPage() {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto px-4 py-10 text-center overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className={title({ color: "yellow" })}>About</h1>
      <p className={subtitle({ class: "mt-6" })}>
        {`Getting ideas from a group can be difficult and time-consuming. Pollish
                offers an interactive and quick way to gather everyone’s input
                instantly, making decision-making and brainstorming easy and fun. Start
                creating visual polls that engage your team or friends right away.`}
      </p>
    </motion.div>
  );
}
