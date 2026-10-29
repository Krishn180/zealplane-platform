import React, { useState, useEffect } from "react";
import axiosInstance from "../../Auth/Axios";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend
} from "recharts";
import { DollarSign, Activity, Users, ShoppingBag } from "lucide-react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Card from "../../components/card/Card";
import CardContent from "../../components/cardcontent/CardContent";
import "./PaymentDashboard.scss";

export default function PaymentDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const email = useSelector((state) => state.user.email) || localStorage.getItem("email");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        if (!email) {
          setError("Admin email required for access.");
          setLoading(false);
          return;
        }

        const res = await axiosInstance.get(`/payment/dashboard?email=${email}`);
        if (res.data.success) {
          setStats(res.data);
        } else {
          setError(res.data.message || "Failed to load dashboard data.");
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.response?.data?.message || "Access Denied or Server Error");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [email]);

  if (loading) {
    return (
      <div className="payment-dashboard-loading">
        <Header />
        <div className="loader">Loading Dashboard Data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-dashboard-error">
        <Header />
        <div className="error-container">
          <h2>⚠️ Access Denied</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const { stats: summaryStats, comicSales, recentTransactions } = stats;

  const pieData = [
    { name: "₹49 Tier", value: summaryStats.tier49Count },
    { name: "₹99 Tier", value: summaryStats.tier99Count },
  ];
  const COLORS = ["#ff4500", "#ec4899"];

  // Process recent transactions for a simple line chart
  // This is a naive grouping by day for demonstration
  const chartDataMap = {};
  recentTransactions.forEach((t) => {
    const date = new Date(t.createdAt).toLocaleDateString();
    if (!chartDataMap[date]) {
      chartDataMap[date] = { date, revenue: 0 };
    }
    chartDataMap[date].revenue += t.amount;
  });
  const chartData = Object.values(chartDataMap).reverse();

  return (
    <>
      <Header />
      <div className="payment-dashboard content-container">
        <h1 className="dashboard-title">Revenue Dashboard</h1>

        {/* Summary Cards */}
        <div className="stats-grid">
          <Card>
            <CardContent>
              <div className="stat-header">
                <h3>Total Revenue</h3>
                <DollarSign className="stat-icon" />
              </div>
              <p className="stat-value">₹{summaryStats.totalRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="stat-header">
                <h3>Transactions</h3>
                <Activity className="stat-icon" />
              </div>
              <p className="stat-value">{summaryStats.totalTransactions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="stat-header">
                <h3>Avg Order Value</h3>
                <ShoppingBag className="stat-icon" />
              </div>
              <p className="stat-value">
                ₹{summaryStats.totalTransactions > 0 ? Math.round(summaryStats.totalRevenue / summaryStats.totalTransactions) : 0}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="stat-header">
                <h3>Comics Sold</h3>
                <Users className="stat-icon" />
              </div>
              <p className="stat-value">{Object.keys(comicSales).length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="charts-grid">
          {/* Revenue Chart */}
          <Card className="revenue-chart-card">
            <CardContent>
              <h3>Recent Revenue Trend</h3>
              <div style={{ height: "300px", marginTop: "20px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }} />
                    <Line type="monotone" dataKey="revenue" stroke="#ff4500" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Tier Breakdown */}
          <Card className="tier-pie-card">
            <CardContent className="centered">
              <h3>Sales by Tier</h3>
              <div style={{ height: "250px", width: "100%", display: "flex", justifyContent: "center" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#111", border: "none" }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Per-Comic Breakdown */}
        <div className="tables-container">
          <Card>
            <CardContent>
              <h3>Revenue by Comic</h3>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Comic Name</th>
                      <th>Copies Sold</th>
                      <th>Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(comicSales).map(([name, data], idx) => (
                      <tr key={idx}>
                        <td>{name}</td>
                        <td>{data.sales}</td>
                        <td className="highlight">₹{data.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                    {Object.keys(comicSales).length === 0 && (
                      <tr>
                        <td colSpan="3" className="empty-state">No sales data available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h3>Recent Transactions</h3>
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Comic</th>
                      <th>Tier</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((t, idx) => (
                      <tr key={idx}>
                        <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                        <td>{t.projectId ? t.projectId.name : "Unknown"}</td>
                        <td>
                          <span className={`tier-badge tier-${t.tier}`}>₹{t.tier}</span>
                        </td>
                        <td className="highlight">₹{t.amount}</td>
                      </tr>
                    ))}
                    {recentTransactions.length === 0 && (
                      <tr>
                        <td colSpan="4" className="empty-state">No transactions yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
