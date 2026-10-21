import { createFileRoute } from "@tanstack/react-router";
import { IdleLove } from "@/components/idle-love";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <IdleLove />;
}
