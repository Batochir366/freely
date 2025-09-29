import { CompanyDetail } from "@/components/CompanyDetail";
import { AuthGuard } from "@/components/AuthGuard";

export default function CompanyDetailPage() {
  return (
    <AuthGuard>
      <CompanyDetail />
    </AuthGuard>
  );
}
