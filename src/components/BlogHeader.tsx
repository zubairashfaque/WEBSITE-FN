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

const BlogHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="container mx-auto px-4 py-8 border-b mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          <span className="relative inline-block">
            <span className="text-[#ff3131] font-bold">Our Blog</span>
            <HandDrawnUnderline width={120} />
          </span>
        </h1>
      </div>
    </div>
  );
};

export default BlogHeader;

export default BlogHeader;
