import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StockUsageEntry.css';
import API_URL from '../config.js';

const StockUsageEntry = ({ existingUsage = null, onSave = () => {} }) => {
  const [stockName, setStockName] = useState('');
  const [quantityUsed, setQuantityUsed] = useState('');
  const [unit, setUnit] = useState('kg');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (existingUsage) {
      setStockName(existingUsage.stockName || '');
      setQuantityUsed(existingUsage.quantityUsed || '');
      setUnit(existingUsage.unit || 'kg');
      setDate(existingUsage.date ? existingUsage.date.substring(0, 10) : '');
    }
  }, [existingUsage]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmAction = window.confirm('Are you sure you want to save the stock usage?');
    if (!confirmAction) return;

    const usageData = { stockName, quantityUsed, unit, date };

    try {
      const url = existingUsage
        ? `${API_URL}/api/stock-usage/update-usage`
        : `${API_URL}/api/stock-usage/add`;
      const method = existingUsage ? 'put' : 'post';

      await axios({
        method,
        url,
        data: usageData,
        headers: { 'Content-Type': 'application/json' },
      });

      alert('Stock usage saved successfully!');
      onSave();
    } catch (error) {
      console.error('Error saving stock usage:', error);
      alert('Error saving stock usage. Please try again!');
    }
  };

  return (
    <div className="stock-usage-container">
      <h3>{existingUsage ? 'Edit Stock Usage' : 'Add Stock Usage'}</h3>
      <form className="stock-usage-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Stock Name</label>
          <input
            type="text"
            value={stockName}
            onChange={(e) => setStockName(e.target.value)}
            required
            placeholder="Enter stock name"
          />
        </div>

        <div className="form-group">
          <label>Quantity Used</label>
          <input
            type="number"
            value={quantityUsed}
            onChange={(e) => setQuantityUsed(e.target.value)}
            required
            placeholder="Enter quantity used"
          />
        </div>

        <div className="form-group">
          <label>Unit</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)} required>
            <option value="kg">Kilograms (kg)</option>
            <option value="liters">Liters</option>
            <option value="pieces">Pieces</option>
            <option value="grams">Grams</option>
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <button type="submit">{existingUsage ? 'Update' : 'Add'} Stock Usage</button>
        </div>
      </form>
    </div>
  );
};

export default StockUsageEntry;