import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StockManagement.css";
import API_URL from '../config.js';

import { TfiPackage } from "react-icons/tfi";
import { MdEdit } from "react-icons/md";
import { MdAddCircleOutline, MdOutlineSystemUpdateAlt } from "react-icons/md";
import { BsClipboard2Check } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";

const StockManagement = () => {
  const [stock, setStock] = useState({
    name: "",
    category: "",
    type: "",
    quantity: 1,
  });
  const [stockList, setStockList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/inventory-stock`);
      setStockList(response.data);
    } catch (error) {
      console.error("Error fetching stock:", error);
    }
  };

  const handleChange = (e) => {
    setStock({ ...stock, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/inventory-stock/${editingId}`, stock);
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/api/inventory-stock`, stock);
      }
      setStock({ name: "", category: "", type: "", quantity: 1 });
      fetchStock();
    } catch (error) {
      console.error("Error saving stock:", error);
    }
  };

  const handleEdit = (item) => {
    setStock({
      name: item.name,
      category: item.category,
      type: item.type,
      quantity: item.quantity,
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stock item?")) return;
    try {
      await axios.delete(`${API_URL}/api/inventory-stock/${id}`);
      fetchStock();
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2><TfiPackage /> Stock Management</h2>
      </div>

      <div className="inventory-content">
        {/* Stock Form */}
        <div className="stock-form">
          <h3>
            {editingId ? (
              <>
                <MdEdit /> Edit Stock
              </>
            ) : (
              <>
                <MdAddCircleOutline /> Add Stock
              </>
            )}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Stock Name</label>
              <input type="text" name="name" value={stock.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" name="category" value={stock.category} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Type</label>
              <input type="text" name="type" value={stock.type} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input type="number" name="quantity" value={stock.quantity} onChange={handleChange} required min="1" />
            </div>
            <button type="submit" className={editingId ? "edit-btn" : "add-btn"}>
              {editingId ? (
                <>
                  <MdOutlineSystemUpdateAlt /> Update Stock
                </>
              ) : (
                <>
                  <MdAddCircleOutline /> Add Stock
                </>
              )}
            </button>
          </form>
        </div>

        {/* Stock List */}
        <div className="stock-list">
          <h3><BsClipboard2Check /> Current Stock</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stockList.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.type}</td>
                  <td>
                    <span className={item.quantity < 5 ? "low-stock" : "stock-ok"}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(item)}>
                      <MdEdit />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                      <RiDeleteBin6Line /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;