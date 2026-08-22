import { isAdminPageRequest } from "@/app/lib/admin-auth";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminPageRequest();

  return (
    <main className="adminPage">
      {authenticated ? <AdminDashboard /> : <AdminLogin />}
    </main>
  );
}
