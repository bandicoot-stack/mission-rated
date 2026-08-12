import { getHomepageData } from "@/lib/data";
import { HomePage } from "@/components/home-page";

export default async function Page() {
  const data = await getHomepageData();
  return <HomePage data={data} />;
}
