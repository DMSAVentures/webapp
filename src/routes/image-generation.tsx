import { createFileRoute } from '@tanstack/react-router'
import ImageGenBox from "@/components/ai/imagegenbox.tsx";
import {motion} from "motion/react";


export const Route = createFileRoute('/image-generation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <motion.div initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.6}}>
    <ImageGenBox/>
  </motion.div>;
}
