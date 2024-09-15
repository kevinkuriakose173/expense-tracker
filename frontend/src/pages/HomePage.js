import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const calculateTotalBalance = (expenses) => {
  return expenses.reduce((acc, expense) => acc + expense.amount, 0).toFixed(2);
};

function HomePage({ setIsAuthenticated }) {
  const [expenses, setExpenses] = useState([]);  // State to store the user's expenses
  const [newExpense, setNewExpense] = useState({ description: '', amount: 0 });  // New expense state
  const [editingExpense, setEditingExpense] = useState(null);  // Track the expense being edited
  const [editFormData, setEditFormData] = useState({ description: '', amount: 0 });
  const [totalBalance, setTotalBalance] = useState(0);  // State to store total balance
  const [error, setError] = useState('');  // State to handle any errors
  const navigate = useNavigate();

  // Fetch the user's expenses when the component mounts
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/expenses', {
          withCredentials: true,  // Send cookies with the request
        });
        setExpenses(response.data);  // Store the fetched expenses in state
      } catch (err) {
        console.error('Error fetching expenses:', err);
        setError('Failed to fetch expenses');
        navigate('/login');  // Redirect to login if there's an issue (e.g., not logged in)
      }
    };

    fetchExpenses();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true })
      .then(() => {
        navigate('/login');
        setIsAuthenticated(false);
        console.log('Navigating to login page');
      });
  };

  useEffect(() => {
    const total = calculateTotalBalance(expenses);
    setTotalBalance(total);
  }, [expenses]);

  // Handle adding a new expense
  const handleAddExpense = async (e) => {
    e.preventDefault();

    console.log(newExpense);
    try {
      const response = await axios.post('http://localhost:5000/api/expenses', newExpense, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      setExpenses([...expenses, response.data]);  // Add the new expense to the list
      setNewExpense({ description: '', amount: 0 });  // Clear the form
    } catch (err) {
      console.error(err);
      setError('Failed to add expense');
    }
  };

  // Handle editing an expense
  const handleEditClick = (expense) => {
    setEditingExpense(expense._id);  // Set the current expense being edited
    setEditFormData({ description: expense.description, amount: expense.amount });  // Pre-fill the form with existing data
  };

  // Handle canceling editing
  const handleCancelEdit = () => {
    setEditingExpense(null);  // Exit editing mode
  };

  // Handle saving changes to an expense
  const handleSaveChanges = async (e, id) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/expenses/${id}`, editFormData, {
        withCredentials: true,
      });
      setExpenses(
        expenses.map((expense) => (expense._id === id ? response.data : expense))
      );
      setEditingExpense(null);  // Exit editing mode
    } catch (err) {
      setError('Failed to update expense');
    }
  };

  // Handle deleting an expense
  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        withCredentials: true,
      });
      setExpenses(expenses.filter((expense) => expense._id !== id));  // Remove the deleted expense
    } catch (err) {
      setError('Failed to delete expense');
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Your Expenses</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="card mb-4">
        <div className="card-body text-center">
          <h2>Total Expenses: <span className="text-danger">${totalBalance}</span></h2>
        </div>
      </div>

      {/* Form to add a new expense */}
      <form onSubmit={handleAddExpense} className="mb-4">
        <div className="form-group mb-3">
          <input
            type="text"
            placeholder="Description"
            className="form-control"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            required
          />
        </div>
        <div className="form-group mb-3">
          <input
            type="number"
            placeholder="Amount"
            className="form-control"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Expense</button>
      </form>

      {/* List of expenses */}
      {expenses.length > 0 ? (
      <table className="table">
        <thead>
          <tr>
            <th>Description</th>
            <th className="text-end">Amount</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              {editingExpense === expense._id ? (
                // If the expense is being edited, show input fields and buttons
                <>
                  <td>
                    <input
                      type="text"
                      value={editFormData.description}
                      className="form-control"
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editFormData.amount}
                      className="form-control text-end"
                      onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                      required
                    />
                  </td>
                  <td className="text-end">
                    <button type="submit" className="btn btn-success me-2" onClick={(e) => handleSaveChanges(e, expense._id)}>Confirm</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{expense.description}</td>
                  <td className="text-end">${expense.amount.toFixed(2)}</td>
                  <td className="text-end">
                    <button className="btn btn-warning me-2" onClick={() => handleEditClick(expense)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDeleteExpense(expense._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>You have no expenses!</p>
    )}
      <button className="btn btn-danger mt-4" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default HomePage;
