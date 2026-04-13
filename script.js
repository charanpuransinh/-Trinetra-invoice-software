// TRINETRA MASTER SCRIPT - FINAL VERSION (NO HINDI)

let parties = JSON.parse(localStorage.getItem('trinetra_parties')) || [];
let items = JSON.parse(localStorage.getItem('trinetra_items')) || [];
let bills = JSON.parse(localStorage.getItem('trinetra_bills')) || [];
let expenses = JSON.parse(localStorage.getItem('trinetra_expenses')) || [];
let cart = [];
let currentBillType = 'Invoice';

window.onload = () => {
    const page = document.body.getAttribute('data-page');
    if (page === 'parties') renderParties();
    if (page === 'items') renderItems();
    if (page === 'billing') loadBillingData();
    if (page === 'accounts') renderAccounts();
};

function saveData() {
    localStorage.setItem('trinetra_parties', JSON.stringify(parties));
    localStorage.setItem('trinetra_items', JSON.stringify(items));
    localStorage.setItem('trinetra_bills', JSON.stringify(bills));
    localStorage.setItem('trinetra_expenses', JSON.stringify(expenses));
}

// PARTY LOGIC
function addParty() {
    const name = document.getElementById('pName').value;
    if (!name) return alert("Required: Name");
    parties.push({ id: Date.now(), name, gst: document.getElementById('pGst').value || 'N/A', phone: document.getElementById('pPhone').value || 'N/A' });
    saveData(); renderParties();
}
function renderParties() {
    const list = document.getElementById('partyList'); if (!list) return;
    list.innerHTML = parties.map(p => `<tr><td>${p.name}</td><td>${p.phone}</td><td><button onclick="deleteParty(${p.id})">DEL</button></td></tr>`).join('');
}
function deleteParty(id) { if (confirm("Delete?")) { parties = parties.filter(p => p.id !== id); saveData(); renderParties(); } }

// ITEM LOGIC
function addItem() {
    const name = document.getElementById('itemName').value;
    if (!name) return alert("Required: Name");
    items.push({ id: Date.now(), name, price: document.getElementById('itemPrice').value || 0, stock: document.getElementById('itemStock').value || 0 });
    saveData(); renderItems();
}
function renderItems() {
    const list = document.getElementById('itemList'); if (!list) return;
    list.innerHTML = items.map(i => `<tr><td>${i.name}</td><td>₹${i.price}</td><td>${i.stock}</td><td><button onclick="deleteItem(${i.id})">DEL</button></td></tr>`).join('');
}
function deleteItem(id) { if (confirm("Delete?")) { items = items.filter(i => i.id !== id); saveData(); renderItems(); } }

// BILLING LOGIC
function loadBillingData() {
    document.getElementById('billParty').innerHTML = '<option value="">Select Party</option>' + parties.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    document.getElementById('billItem').innerHTML = '<option value="">Select Item</option>' + items.map(i => `<option value="${i.id}">${i.name}</option>`).join('');
}
function addToCart() {
    const itemId = document.getElementById('billItem').value;
    const qty = document.getElementById('billQty').value;
    if (!itemId || !qty) return;
    const item = items.find(i => i.id == itemId);
    cart.push({ name: item.name, qty: parseInt(qty), total: item.price * qty });
    renderCart();
}
function renderCart() {
    let total = 0;
    document.getElementById('cartList').innerHTML = cart.map(c => { total += c.total; return `<tr><td>${c.name}</td><td>${c.qty}</td><td>₹${c.total}</td></tr>` }).join('');
    document.getElementById('grandTotal').innerText = total;
}
function generateBill() {
    if (cart.length === 0) return;
    bills.push({ id: Date.now(), party: "Customer", total: document.getElementById('grandTotal').innerText, date: new Date().toLocaleDateString() });
    saveData(); alert("Saved!"); location.reload();
}

// ACCOUNTS LOGIC
function addExpense() {
    const note = document.getElementById('expNote').value;
    const amt = document.getElementById('expAmount').value;
    if (!note || !amt) return;
    expenses.push({ note, amt: parseFloat(amt), date: new Date().toLocaleDateString() });
    saveData(); renderAccounts();
}
function renderAccounts() {
    let totalSales = bills.reduce((sum, b) => sum + parseFloat(b.total), 0);
    let totalExp = expenses.reduce((sum, e) => sum + e.amt, 0);
    document.getElementById('accTotalSales').innerText = "₹" + totalSales;
    document.getElementById('accTotalExp').innerText = "₹" + totalExp;
    document.getElementById('billHistoryList').innerHTML = bills.map(b => `<tr><td>${b.date}</td><td>${b.party}</td><td>₹${b.total}</td></tr>`).join('');
      }
  
