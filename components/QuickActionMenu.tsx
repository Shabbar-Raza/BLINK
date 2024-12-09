import React from 'react';
import { motion } from 'framer-motion';

const QuickActionMenu = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-24 left-0 right-0 bg-white p-4 rounded-t-3xl shadow-lg"
    >
      {/* Quick action buttons can go here */}
    </motion.div>
  );
};

export default QuickActionMenu; 