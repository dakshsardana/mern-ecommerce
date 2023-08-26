import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";
export default function Home() {
  const { data: sessions } = useSession();
  return (
    <Layout>
      <div className="flex text-green-900 gap-3 justify-between">
        <div>
          Hello, <strong>{sessions?.user?.name}</strong>
        </div>
        <div className="flex gap-2 bg-gray-200 p-2 rounded-lg">
          <Image
            src={sessions?.user?.image}
            width={25}
            height={25}
            className="rounded-full"
            alt="profile-photo"
          />
          <div>{sessions?.user?.name}</div>
        </div>
      </div>
    </Layout>
  );
}
