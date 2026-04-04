import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  BarChart, Bar,
  PieChart, Pie, Cell,
} from "recharts";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(result => {
        console.log("DATA:", result);
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.log("ERROR:", err);

        // 🔥 FALLBACK DATA (BIAR PASTI ADA DATA)
        const dummy = [
          { id: 1, title: "Product A", price: 100, category: "electronics" },
          { id: 2, title: "Product B", price: 200, category: "fashion" },
          { id: 3, title: "Product C", price: 150, category: "electronics" },
          { id: 4, title: "Product D", price: 80, category: "fashion" },
        ];

        setData(dummy);
        setLoading(false);
      });
  }, []);

  // ================= LOADING =================
  if (loading) {
    return <h1 style={{ textAlign: "center" }}>Loading...</h1>;
  }

  // ================= KPI =================
  const total = data.length;

  const avgPrice =
    data.reduce((sum, item) => sum + item.price, 0) / total || 0;

  const totalCategory =
    [...new Set(data.map(item => item.category))].length;

  // ================= DATA CHART =================
  const categoryData = Object.values(
    data.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || {
        name: item.category,
        total: 0
      };
      acc[item.category].total += 1;
      return acc;
    }, {})
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>
        📊 Dashboard Data Visualization
      </h1>

      {/* KPI */}
      <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
        <div style={card}>
          <h3>Total Produk</h3>
          <p>{total}</p>
        </div>

        <div style={card}>
          <h3>Rata-rata Harga</h3>
          <p>${avgPrice.toFixed(2)}</p>
        </div>

        <div style={card}>
          <h3>Total Kategori</h3>
          <p>{totalCategory}</p>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", justifyContent: "center" }}>

        <div>
          <h3>Trend Harga</h3>
          <LineChart width={400} height={300} data={data}>
            <XAxis dataKey="id" />
            <YAxis />
            <Tooltip />
            <Line dataKey="price" stroke="#8884d8" />
          </LineChart>
        </div>

        <div>
          <h3>Jumlah per Kategori</h3>
          <BarChart width={400} height={300} data={categoryData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#82ca9d" />
          </BarChart>
        </div>

        <div>
          <h3>Distribusi</h3>
          <PieChart width={400} height={300}>
            <Pie data={categoryData} dataKey="total" outerRadius={100}>
              {categoryData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>

      </div>

      {/* Table */}
      <table border="1" style={{ width: "100%", marginTop: "30px" }}>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Harga</th>
            <th>Kategori</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.price}</td>
              <td>{item.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const card = {
  background: "#eee",
  padding: "20px",
  borderRadius: "10px",
  width: "200px",
  textAlign: "center"
};

export default App;