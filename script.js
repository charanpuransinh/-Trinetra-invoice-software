// TRINETRA MASTER SCRIPT - VERSION 2 (NO HINDI)

let parties = JSON.parse(localStorage.getItem('trinetra_parties')) || [];
let items = JSON.parse(localStorage.getItem('trinetra_items')) || [];

window.onload = () => {
    const page = document.body.getAttribute('data-page');
    if (page === 'parties') renderParties();
    if (page === 'items') renderItems();
};

// --- PARTY FUNCTIONS ---
function addParty() {
    const name = document.getElementById('pName').value;
    const gst = document.getElementById('pGst').value;
    const phone = document.getElementById('pPhone').value;

    if (name === "") {
        alert("Error: Party Name is Required");
        return;
    }

    const newParty = { id: Date.now(), name: name, gst: gst || 'N/A', phone: phone || 'N/A' };
    parties.push(newParty);
    saveData();
    renderParties();
    clearInputs(['pName', 'pGst', 'pPhone']);
}

function deleteParty(id) {
    if (confirm("Delete this party?")) {
        parties = parties.filter(p => p.id !== id);
        saveData();
        renderParties();
    }
}

function renderParties() {
    const list = document.getElementById('partyList');
    if (!list) return;
    if (parties.length === 0) {
        list.innerHTML = '<tr><td colspan="3" style="text-align:center;">No Parties Found</td></tr>';
        return;
    }
    list.innerHTML = parties.map(p => `
        <tr>
            <td><strong>${p.name}</strong></td>
            <td>${p.gst}<br><small>${p.phone}</small></td>
            <td><button onclick="deleteParty(${p.id})" style="background:#c0392b; color:white; border:none; padding:5px; border-radius:4px;">DEL</button></td>
        </tr>
    `).join('');
}

// --- ITEM & STOCK FUNCTIONS ---
function addItem() {
    const name = document.getElementById('itemName').value;
    const hsn = document.getElementById('itemHsn').value;
    const gst = document.getElementById('itemGst').value;
    const price = document.getElementById('itemPrice').value;
    const stock = document.getElementById('itemStock').value;

    if (name === "") {
        alert("Error: Item Name is Required");
        return;
    }

    const newItem = {
        id: Date.now(),
        name: name,
        hsn: hsn || 'N/A',
        gst: gst || '0',
        price: price || '0',
        stock: stock || '0'
    };

    items.push(newItem);
    saveData();
    renderItems();
    clearInputs(['itemName', 'itemHsn', 'itemGst', 'itemPrice', 'itemStock']);
}

function deleteItem(id) {
    if (confirm("Delete this item?")) {
        items = items.filter(i => i.id !== id);
        saveData();
        renderItems();
    }
}

function renderItems() {
    const list = document.getElementById('itemList');
    if (!list) return;
    if (items.length === 0) {
        list.innerHTML = '<tr><td colspan="4" style="text-align:center;">No Items Found</td></tr>';
        return;
    }
    list.innerHTML = items.map(i => `
        <tr>
            <td><strong>${i.name}</strong><br><small>HSN: ${i.hsn}</small></td>
            <td>₹${i.price}<br><small>GST: ${i.gst}%</small></td>
            <td>${i.stock}</td>
            <td><button onclick="deleteItem(${i.id})" style="background:#c0392b; color:white; border:none; padding:5px; border-radius:4px;">DEL</button></td>
        </tr>
    `).join('');
}

// --- UTILITY ---
function saveData() {
    localStorage.setItem('trinetra_parties', JSON.stringify(parties));
    localStorage.setItem('trinetra_items', JSON.stringify(items));
}

function clearInputs(ids) {
    ids.forEach(id => document.getElementById(id).value = '');
}
