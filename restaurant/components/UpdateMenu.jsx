import React, { useState, useEffect } from "react";
import axios from "axios";
import './UpdateMenu.css';

const categories = ["Starters", "Main Course", "Desserts", "Juices", "Soft Drinks", "soups"];

const UpdateMenu = () => {
    const userId = localStorage.getItem("user_id");
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({
        name: "",
        price: "",
        category: categories[0],
        image: null,
        imagePreview: null
    });
    const [uploadingItems, setUploadingItems] = useState(new Set());

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/menu/getMenuItems", { user_id: userId });
            setItems(response.data.items);
        } catch (error) {
            console.error("Error fetching menu:", error);
            alert("Failed to fetch menu items");
        }
    };

    const handleImageSelect = (e, isNewItem = true, itemId = null) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            if (isNewItem) {
                setNewItem(prev => ({
                    ...prev,
                    image: file,
                    imagePreview: event.target.result
                }));
            } else {
                // Handle existing item image update
                setItems(prev => prev.map(item =>
                    item._id === itemId
                        ? { ...item, tempImage: file, tempImagePreview: event.target.result }
                        : item
                ));
            }
        };
        reader.readAsDataURL(file);
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post("http://localhost:5000/api/menu/uploadImage", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.imageUrl;
        } catch (error) {
            console.error("Image upload error:", error);
            throw new Error("Failed to upload image");
        }
    };

    const handleAddItem = async () => {
        const { name, price, category, image } = newItem;
        if (!name || !price || !category) {
            alert("Please fill out all fields");
            return;
        }

        try {
            let imageUrl = null;

            if (image) {
                setUploadingItems(prev => new Set(prev).add('new'));
                imageUrl = await uploadImage(image);
            }

            await axios.post("http://localhost:5000/api/menu/addMenuItem", {
                user_id: userId,
                name,
                price,
                category,
                image_url: imageUrl,
            });

            fetchMenu();
            setNewItem({
                name: "",
                price: "",
                category: categories[0],
                image: null,
                imagePreview: null
            });

            // Clear file input
            const fileInput = document.getElementById('new-item-image');
            if (fileInput) fileInput.value = '';

        } catch (error) {
            console.error("Error adding item:", error);
            alert("Failed to add menu item");
        } finally {
            setUploadingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete('new');
                return newSet;
            });
        }
    };

    const handleUpdateItem = async (id, updated) => {
        const { name, price, category } = updated;
        if (!name || !price || !category) {
            alert("All fields are required");
            return;
        }

        try {
            const item = items.find(item => item._id === id);
            let imageUrl = item.image_url;

            // Check if there's a new image to upload
            if (item.tempImage) {
                setUploadingItems(prev => new Set(prev).add(id));
                imageUrl = await uploadImage(item.tempImage);
            }

            await axios.put(`http://localhost:5000/api/menu/updateMenuItem/${id}`, {
                name,
                price,
                category,
                image_url: imageUrl,
            });

            fetchMenu();
        } catch (error) {
            console.error("Error updating item:", error);
            alert("Failed to update menu item");
        } finally {
            setUploadingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/menu/deleteMenuItem/${id}`);
            fetchMenu();
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete menu item");
        }
    };

    const removeImage = (isNewItem = true, itemId = null) => {
        if (isNewItem) {
            setNewItem(prev => ({
                ...prev,
                image: null,
                imagePreview: null
            }));
            const fileInput = document.getElementById('new-item-image');
            if (fileInput) fileInput.value = '';
        } else {
            setItems(prev => prev.map(item =>
                item._id === itemId
                    ? { ...item, tempImage: null, tempImagePreview: null }
                    : item
            ));
        }
    };

    return (
        <div className="update-menu-container">
            <h2>Update Menu</h2>

            <div className="add-new-item">
                <input
                    type="text"
                    placeholder="Dish Name"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                />
                <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                >
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>

                <div className="image-upload-section">
                    <input
                        type="file"
                        id="new-item-image"
                        accept="image/*"
                        onChange={(e) => handleImageSelect(e, true)}
                        className="file-input"
                    />
                    <label htmlFor="new-item-image" className="file-label">
                        📷 Choose Image
                    </label>

                    {newItem.imagePreview && (
                        <div className="image-preview">
                            <img src={newItem.imagePreview} alt="Preview" className="preview-image" />
                            <button
                                type="button"
                                onClick={() => removeImage(true)}
                                className="remove-image-btn"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleAddItem}
                    disabled={uploadingItems.has('new')}
                    className="add-btn"
                >
                    {uploadingItems.has('new') ? 'Adding...' : 'Add Dish'}
                </button>
            </div>

            <ul className="menu-list">
                {items.map((item) => (
                    <li key={item._id} className="menu-item">
                        <div className="item-details">
                            <input
                                type="text"
                                defaultValue={item.name}
                                onBlur={(e) =>
                                    handleUpdateItem(item._id, { ...item, name: e.target.value })
                                }
                            />
                            <input
                                type="number"
                                defaultValue={item.price}
                                onBlur={(e) =>
                                    handleUpdateItem(item._id, { ...item, price: e.target.value })
                                }
                            />
                            <select
                                defaultValue={item.category}
                                onChange={(e) =>
                                    handleUpdateItem(item._id, { ...item, category: e.target.value })
                                }
                            >
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="image-section">
                            {(item.image_url || item.tempImagePreview) && (
                                <div className="current-image">
                                    <img
                                        src={item.tempImagePreview || `http://localhost:5000${item.image_url}`}
                                        alt={item.name}
                                        className="dish-image"
                                    />
                                    {item.tempImagePreview && (
                                        <button
                                            type="button"
                                            onClick={() => removeImage(false, item._id)}
                                            className="remove-image-btn small"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="image-upload-section">
                                <input
                                    type="file"
                                    id={`image-${item._id}`}
                                    accept="image/*"
                                    onChange={(e) => handleImageSelect(e, false, item._id)}
                                    className="file-input"
                                />
                                <label htmlFor={`image-${item._id}`} className="file-label small">
                                    📷
                                </label>
                            </div>
                        </div>

                        <div className="item-actions">
                            {item.tempImage && (
                                <button
                                    className="update-btn"
                                    onClick={() => handleUpdateItem(item._id, item)}
                                    disabled={uploadingItems.has(item._id)}
                                >
                                    {uploadingItems.has(item._id) ? 'Updating...' : 'Update'}
                                </button>
                            )}
                            <button
                                className="delete-btn"
                                onClick={() => handleDeleteItem(item._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UpdateMenu;