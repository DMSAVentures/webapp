import { createFileRoute } from '@tanstack/react-router'
import ChatBox from "@/components/ai/chatbox.tsx";

export const Route = createFileRoute('/conversation')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ChatBox />;
}
