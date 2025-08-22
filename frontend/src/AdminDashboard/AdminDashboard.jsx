import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent } from "../UiCard/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
console.log("Backend URL:", VITE_BACKEND_URL); // just to confirm

export const AdminDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      // ✅ Send cookies along with request
      const res = await axios.get(`${VITE_BACKEND_URL}api/admin/stats`, {
        withCredentials: true,
      });
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500">
        Error loading dashboard: {error.message}
      </p>
    );
  }

  const chartData = [
    { name: "Weekly Orders", value: data?.weeklyOrders || 0 },
    { name: "Monthly Orders", value: data?.monthlyOrders || 0 },
    { name: "Weekly Users", value: data?.weeklyUsers || 0 },
    { name: "Monthly Users", value: data?.monthlyUsers || 0 },
  ];

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overview Card */}
        <Card>
          <CardContent>
            <h3 className="text-xl font-semibold mb-4">Overview</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                🛒 Weekly Orders: <b>{data?.weeklyOrders || 0}</b>
              </li>
              <li>
                🛒 Monthly Orders: <b>{data?.monthlyOrders || 0}</b>
              </li>
              <li>
                👥 Weekly Users: <b>{data?.weeklyUsers || 0}</b>
              </li>
              <li>
                👥 Monthly Users: <b>{data?.monthlyUsers || 0}</b>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Trends Chart */}
        <Card>
          <CardContent>
            <h3 className="text-xl font-semibold mb-4">Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
