import { createFileRoute } from '@tanstack/react-router'
import ChatBox from "@/components/ai/chatbox";

import { motion } from "motion/react";
export const Route = createFileRoute('/conversation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <motion.div initial={{opacity: 0}}
    animate={{opacity: 1}}
    transition={{duration: 0.6}}>
    <ChatBox/>
  </motion.div>;
}
