import React from 'react';
import { motion } from 'framer-motion';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  return (
    <motion.div 
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50"
    >
      {/* Add your sidebar content here */}
    </motion.div>
  );
};

export default Sidebar; 