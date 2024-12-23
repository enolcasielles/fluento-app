import { prisma } from "@/core/lib/prisma";

export default async function Home() {
  const user = await prisma.user.findUnique({
    where: {
      email: "usuario1@ejemplo.com",
    },
  });
  return (
    <>
      <main className="flex flex-col items-center justify-center">
        Home Page. {user.name}
      </main>
    </>
  );
}
