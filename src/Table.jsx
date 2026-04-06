import React from "react";

const formatCurrency = (value) => `$${value.toFixed(2)}`;

function Table({ products }) {
  return (
    <div className="table-card card">
      <div className="section-heading">
        <h2>Data Produk</h2>
        <p>Daftar produk lengkap dengan harga dan kategori.</p>
      </div>
      <table className="product-table">
        <thead>
          <tr>
            <th>Nama Produk</th>
            <th>Harga</th>
            <th>Kategori</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{formatCurrency(product.price)}</td>
              <td>{product.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
