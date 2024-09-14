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
    <div>
      <h1>Your Expenses</h1>

      <h2>Total Balance: ${totalBalance}</h2>

      {/* Form to add a new expense */}
      <form onSubmit={handleAddExpense}>
        <input
          type="text"
          placeholder="Description"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          required
        />
        <button type="submit">Add Expense</button>
      </form>

      {/* List of expenses */}
      {expenses.length > 0 ? (
        <ul>
          {expenses.map((expense) => (
            <li key={expense._id}>
              {editingExpense === expense._id ? (
                // If the expense is being edited, show input fields and buttons
                <form onSubmit={(e) => handleSaveChanges(e, expense._id)}>
                  <input
                    type="text"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    value={editFormData.amount}
                    onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                    required
                  />
                  <button type="submit">Confirm</button>
                  <button type="button" onClick={handleCancelEdit}>Cancel</button>
                </form>
              ) : (
                <>
                  {/* Display the expense if it's not being edited */}
                  {expense.description}: ${expense.amount.toFixed(2)}
                  <button onClick={() => handleEditClick(expense)}>Edit</button>
                  <button onClick={() => handleDeleteExpense(expense._id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no expenses!</p>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default HomePage;
