"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-soft"
    >
      <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      {description && <p className="mb-3 mt-0.5 text-xs text-gray-500">{description}</p>}
      <div className="mt-3">{children}</div>
    </motion.section>
  );
}
