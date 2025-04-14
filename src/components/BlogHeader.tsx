import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function HandDrawnUnderline({
  width,
  offsetX,
}: {
  width: number;
  offsetX?: number;
}) {
  return (
    <svg
      viewBox={`0 0 ${width} 40`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-[-6px] h-[14px]"
      style={{ width, left: offsetX || 0 }}
    >
      <motion.path
        d={`M3 20 C${width * 0.25} 30, ${width * 0.5} 10, ${width * 0.75} 25, ${width - 5} 10`}
        stroke="#ff3131"
        strokeWidth="6"
        fill="transparent"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </svg>
  );
}


export default BlogHeader;
