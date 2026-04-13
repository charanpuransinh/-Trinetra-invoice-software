// TRINETRA MASTER SCRIPT - VERSION 3 (ZERO HINDI)

let parties = JSON.parse(localStorage.getItem('trinetra_parties')) || [];
let items = JSON.parse(localStorage.getItem('trinetra_items')) || [];
let bills = JSON.parse(localStorage.getItem('trinetra_bills')) || [];
let cart = [];
let currentBillType = 'Invoice';

window.onload = () => {
    const page = document.body.getAttribute('data-page');
    if (page === 'parties') renderParties();
    if (page === 'items') renderItems();
    if (page === 'billing') loadBillingData();
};

// --- COMMON DATA SAVE ---
function saveData() {
    localStorage.setItem('trinetra_parties', JSON.stringify(parties));
    localStorage.setItem('trinetra_items', JSON.stringify(items));
    localStorage.setItem('trinetra_bills', JSON.stringify(bills));
}

// --- PARTY SECTION ---
function addParty() {
    const name = document.getElementById('pName').value;
    const gst = document.getElementById('pGst').value;
    const phone = document.getElementById('pPhone').value;
    if (name === "") return alert("Party Name Required");
    parties.push({ id: Date.now(), name, gst: gst || 'N/A', phone: phone || 'N/A' });
    saveData();
    renderParties();
    ['pName', 'pGst', 'pPhone'].forEach(id => document.getElementById(id).value = '');
}

function renderParties() {
    const list = document.getElementById('partyList');
    if (!list) return;
    list.innerHTML = parties.map(p => `
        <tr><td><strong>${p.name}</strong></td><td>${p.gst}<br><small>${p.phone}</small></td>
        <td><button onclick="deleteParty(${p.id})" style="background:#c0392b; color:white; border:none; padding:5px; border-radius:4px;">DEL</button></td></tr>
    `).join('');
}

function deleteParty(id) {
    if (confirm("Delete Party?")) { parties = parties.filter(p => p.id !== id); saveData(); renderParties(); }
}

// --- ITEM SECTION ---
function addItem() {
    const name = document.getElementById('itemName').value;
    const hsn = document.getElementById('itemHsn').value;
    const gst = document.getElementById('itemGst').value;
    const price = document.getElementById('itemPrice').value;
    const stock = document.getElementById('itemStock').value;
    if (name === "") return alert("Item Name Required");
    items.push({ id: Date.now(), name, hsn: hsn || 'N/A', gst: gst || '0', price: price || '0', stock: stock || '0' });
    saveData();
    renderItems();
    ['itemName', 'itemHsn', 'itemGst', 'itemPrice', 'itemStock'].forEach(id => document.getElementById(id).value = '');
}

function renderItems() {
    const list = document.getElementById('itemList');
    if (!list) return;
    list.innerHTML = items.map(i => `
        <tr><td><strong>${i.name}</strong><br><small>HSN: ${i.hsn}</small></td>
        <td>₹${i.price}<br><small>GST: ${i.gst}%</small></td><td>${i.stock}</td>
        <td><button onclick="deleteItem(${i.id})" style="background:#c0392b; color:white; border:none; padding:5px; border-radius:4px;">DEL</button></td></tr>
    `).join('');
}

function deleteItem(id) {
    if (confirm("Delete Item?")) { items = items.filter(i => i.id !== id); saveData(); renderItems(); }
}

// --- BILLING SECTION ---
function loadBillingData() {
    const pSelect = document.getElementById('billParty');
    const iSelect = document.getElementById('billItem');
    if (!pSelect || !iSelect) return;
    
    pSelect.innerHTML = '<option value="">Select Party</option>' + parties.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    iSelect.innerHTML = '<option value="">Select Item</option>' + items.map(i => `<option value="${i.id}">${i.name}</option>`).join('');
}

function setBillType(type) {
    currentBillType = type;
    document.getElementById('typeInv').style.background = (type === 'Invoice') ? '#FFD700' : '#555';
    document.getElementById('typeQuo').style.background = (type === 'Quotation') ? '#FFD700' : '#555';
    document.getElementById('typeInv').style.color = (type === 'Invoice') ? '#000' : '#fff';
    document.getElementById('typeQuo').style.color = (type === 'Quotation') ? '#000' : '#fff';
}

function addToCart() {
    const itemId = document.getElementById('billItem').value;
    const qty = document.getElementById('billQty').value;
    if (!itemId || !qty) return alert("Select Item and Qty");

    const item = items.find(i => i.id == itemId);
    const total = parseFloat(item.price) * parseInt(qty);
    cart.push({ id: item.id, name: item.name, price: item.price, qty: parseInt(qty), total: total });
    
    renderCart();
    document.getElementById('billQty').value = '';
}

function renderCart() {
    const list = document.getElementById('cartList');
    let grandTotal = 0;
    list.innerHTML = cart.map(c => {
        grandTotal += c.total;
        return `<tr><td>${c.name}</td><td>${c.qty}</td><td>₹${c.total}</td></tr>`;
    }).join('');
    document.getElementById('grandTotal').innerText = grandTotal;
}

function generateBill() {
    const partyId = document.getElementById('billParty').value;
    if (!partyId || cart.length === 0) return alert("Add Party and Items");

    const newBill = {
        billId: Date.now(),
        type: currentBillType,
        party: parties.find(p => p.id == partyId).name,
        items: cart,
        total: document.getElementById('grandTotal').innerText,
        date: new Date().toLocaleDateString()
    };

    bills.push(newBill);
    saveData();
    alert(currentBillType + " Saved Successfully!");
    cart = [];
    renderCart();
    location.reload();
}
