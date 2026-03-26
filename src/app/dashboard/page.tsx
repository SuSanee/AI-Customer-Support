import DashboardClient from "@/components/DashboardClient";
import { getSession } from "@/lib/getSession";

export default async function Dashboard() {
  const session = await getSession();
  const ownerId = session?.user?.id!;
  return (
    <>
      <DashboardClient ownerId={ownerId} />
    </>
  );
}
