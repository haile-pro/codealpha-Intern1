// script.js
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function addExpense(event) {
  event.preventDefault();
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('date').value;
  
  const expense = { id: Date.now(), description, amount, date };
  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  displayExpenses();
  this.reset();
}

document.getElementById('expense-form').addEventListener('submit', addExpense);

function displayExpenses() {
  const expensesList = document.getElementById('expenses-list');
  expensesList.innerHTML = expenses.map(expense => {
    const formattedAmount = expense.amount ? `$${expense.amount.toFixed(2)}` : 'N/A';
    return `
      <div class="expense-item" data-id="${expense.id}">
        <div class="description">${expense.description}</div>
        <div class="amount">${formattedAmount}</div>
        <div class="date">${expense.date}</div>
        <div class="actions">
          <button onclick="editExpense(${expense.id})">Edit</button>
          <button onclick="deleteExpense(${expense.id})">Delete</button>
        </div>
      </div>
    `;
  }).join('');
}

displayExpenses();

function deleteExpense(id) {
  expenses = expenses.filter(expense => expense.id !== id);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  displayExpenses();
}


let currentEditId = null;

function editExpense(id) {
  const expense = expenses.find(expense => expense.id === id);
  document.getElementById('description').value = expense.description;
  document.getElementById('amount').value = expense.amount;
  document.getElementById('date').value = expense.date;
  currentEditId = id; // Set the current edit ID
  
  // Change the button to Save
  const formButton = document.querySelector('#expense-form button');
  formButton.textContent = 'Save';
  formButton.onclick = saveExpense; // Change the event handler to saveExpense
}

function saveExpense(event) {
  event.preventDefault();
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const date = document.getElementById('date').value;
  
  const expenseIndex = expenses.findIndex(expense => expense.id === currentEditId);
  if (expenseIndex !== -1) {
    expenses[expenseIndex] = { id: currentEditId, description, amount, date };
    localStorage.setItem('expenses', JSON.stringify(expenses));
    displayExpenses();
  }

  // Reset the form and the button
  document.getElementById('expense-form').reset();
  const formButton = document.querySelector('#expense-form button');
  formButton.textContent = 'Add Expense';
  formButton.onclick = addExpense; // Change the event handler back to addExpense
  currentEditId = null;
}