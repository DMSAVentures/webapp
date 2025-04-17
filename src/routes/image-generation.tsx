import { createFileRoute } from '@tanstack/react-router'
import ImageGenBox from "@/components/ai/imagegenbox.tsx";

export const Route = createFileRoute('/image-generation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ImageGenBox/>
}
