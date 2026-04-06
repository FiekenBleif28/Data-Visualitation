import React, { useEffect, useState, useMemo } from "react";
import KPI from "./KPI.jsx";
import Charts from "./Charts.jsx";
import Table from "./Table.jsx";

const fallbackProducts = [
  {
    id: 1,
    title: "Fallback Sneakers",
    price: 59.99,
    category: "men's clothing",
  },
  {
    id: 2,
    title: "Fallback Watch",
    price: 149.99,
    category: "jewelery",
  },
  {
    id: 3,
    title: "Fallback Jacket",
    price: 89.5,
    category: "men's clothing",
  },
  {
    id: 4,
    title: "Fallback Dress",
    price: 120.0,
    category: "women's clothing",
  },
];

// Helper Functions
const calculateAveragePrice = (items) => {
  if (!items.length) return 0;
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return total / items.length;
};

const countCategories = (items) =>
  new Set(items.map((item) => item.category)).size;

const getCategoryCount = (items) => {
  return items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
};

const getTopCategory = (items) => {
  const counts = getCategoryCount(items);
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted[0]?.[0] || "-";
};

const getPriceDistribution = (items, avgPrice) => {
  const below = items.filter((item) => item.price < avgPrice).length;
  const above = items.filter((item) => item.price >= avgPrice).length;
  return { below, above };
};

const getTopExpensiveProducts = (items, avgPrice, limit = 2) => {
  return items
    .filter((item) => item.price > avgPrice * 1.8)
    .sort((a, b) => b.price - a.price)
    .slice(0, limit);
};

const truncateText = (text, maxLength = 40) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const formatCurrency = (value) => `$${value.toFixed(2)}`;

const buildInsights = (items) => {
  const avgPrice = calculateAveragePrice(items);
  const topCategory = getTopCategory(items);
  const { below, above } = getPriceDistribution(items, avgPrice);
  const expensiveProducts = getTopExpensiveProducts(items, avgPrice);

  return {
    avgPrice,
    topCategory,
    below,
    above,
    expensiveProducts,
  };
};

const buildTrends = (items, insights) => {
  const trends = [];
  const { avgPrice, topCategory, below, above, expensiveProducts } = insights;

  if (below > above) {
    trends.push("Mayoritas produk berada di bawah rata-rata harga");
  } else if (above > below) {
    trends.push("Mayoritas produk berada di atas rata-rata harga");
  } else {
    trends.push(
      "Distribusi harga seimbang antara di atas dan di bawah rata-rata",
    );
  }

  if (expensiveProducts.length > 0) {
    trends.push("Ditemukan beberapa produk dengan harga ekstrem (outlier)");
  }

  trends.push(`Kategori dengan produk terbanyak adalah "${topCategory}"`);

  const categoryCount = getCategoryCount(items);
  const maxCount = Math.max(...Object.values(categoryCount));
  const dominancePercentage = Math.round((maxCount / items.length) * 100);
  if (dominancePercentage > 30) {
    trends.push(
      `Kategori "${topCategory}" mendominasi dengan ${dominancePercentage}% dari total produk`,
    );
  }

  return trends;
};

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) throw new Error("Fetch failed");
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : fallbackProducts);
      } catch {
        setProducts(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const insights = useMemo(() => buildInsights(products), [products]);
  const trends = useMemo(
    () => buildTrends(products, insights),
    [products, insights],
  );

  const totalProducts = products.length;
  const totalCategories = countCategories(products);

  return (
    <main className="dashboard-layout">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">Dashboard</p>
          <h1 className="dashboard-title">Analisis Data Produk</h1>
          <p className="dashboard-description">
            Visualisasi data produk dari Fake Store API. Ringkasan KPI, chart,
            insight, dan tabel.
          </p>
        </div>
      </section>

      <section className="kpi-grid">
        <KPI
          totalProducts={totalProducts}
          averagePrice={insights.avgPrice}
          totalCategories={totalCategories}
        />
      </section>

      <section className="chart-grid">
        <Charts products={products} />
      </section>

      <section className="insight-section card">
        <div className="section-heading">
          <h2>Insight & Rekomendasi</h2>
          <p>Rekomendasi otomatis berdasarkan data produk.</p>
        </div>

        {isLoading ? (
          <p className="loading-text">Memuat insight...</p>
        ) : (
          <div className="insight-grid">
            <div className="insight-item">
              <h3>Kategori Teratas</h3>
              <p>{insights.topCategory}</p>
            </div>

            <div className="insight-item">
              <h3>Distribusi Harga</h3>
              <p>
                {insights.below} produk di bawah rata-rata, {insights.above}{" "}
                produk di atas rata-rata.
              </p>
            </div>

            <div className="insight-item">
              <h3>Produk Harga Tinggi</h3>
              <p>
                {insights.expensiveProducts.length > 0
                  ? insights.expensiveProducts
                      .map(
                        (item) =>
                          `${truncateText(item.title)} - ${formatCurrency(item.price)}`,
                      )
                      .join(", ")
                  : "Tidak ada produk ekstrem."}
              </p>
            </div>

            <div className="insight-item trend-item">
              <h3>Tren Data</h3>
              <ul className="trend-list">
                {trends.map((trend, index) => (
                  <li key={index}>{trend}</li>
                ))}
              </ul>
            </div>

            <div className="insight-item recommendation">
              <h3>Rekomendasi</h3>
              <ul>
                <li>Fokuskan promosi pada kategori {insights.topCategory}.</li>
                <li>
                  Evaluasi harga produk di atas{" "}
                  {formatCurrency(insights.avgPrice * 1.8)}.
                </li>
                <li>Tambahkan variasi produk pada kategori populer.</li>
              </ul>
            </div>
          </div>
        )}
      </section>

      <section className="table-section">
        <Table products={products} />
      </section>
    </main>
  );
}

export default Dashboard;
