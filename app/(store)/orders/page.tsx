import { getMyOrders } from "@/sanity/lib/orders/getMyOrders";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import OrdersTabs from "./OrdersTabs";

export default async function OrdersPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/");

  const orders = await getMyOrders(userId);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <OrdersTabs orders={orders} />
    </div>
  );
}
