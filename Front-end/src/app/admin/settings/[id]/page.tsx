import { AdminSettings } from "@/components/AdminSettings";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Settings() {
  return (
    <ScrollArea className="w-screen h-screen bg-gray-200 rounded-lg">
      <AdminSettings />
    </ScrollArea>
  );
}
