import { motion } from "framer-motion";
import { Nfc } from "lucide-react";

export function NFCPulse({ size = 72 }: { size?: number }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {[0, 0.6, 1.2].map((delay) => (
        <motion.span
          key={delay}
          className="absolute inset-0 rounded-full border border-primary"
          initial={{ scale: 0.5, opacity: 0.7 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 1.8, repeat: Infinity, delay, ease: "easeOut" }}
        />
      ))}
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
        <Nfc className="h-5 w-5" />
      </div>
    </div>
  );
}