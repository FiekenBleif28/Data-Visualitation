import React from "react";

function KPI({ totalProducts, averagePrice, totalCategories }) {
  return (
    <>
      <div className="kpi-card card">
        <span className="kpi-label">Total Produk</span>
        <p className="kpi-value">{totalProducts}</p>
      </div>
      <div className="kpi-card card">
        <span className="kpi-label">Rata-rata Harga</span>
        <p className="kpi-value">${averagePrice.toFixed(2)}</p>
      </div>
      <div className="kpi-card card">
        <span className="kpi-label">Total Kategori</span>
        <p className="kpi-value">{totalCategories}</p>
      </div>
    </>
  );
}

export default KPI;
