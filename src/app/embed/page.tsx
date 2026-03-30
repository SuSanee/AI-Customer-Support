import EmbedClient from "@/components/EmbedClient";
import { getSession } from "@/lib/getSession";

async function page() {
  const session = await getSession();

  return (
    <>
      <EmbedClient ownerId={session?.user?.id!} />
    </>
  );
}

export default page;
