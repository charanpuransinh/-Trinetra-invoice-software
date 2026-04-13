// TRINETRA BRAIN - MASTER SCRIPT (English Version Only)

let parties = JSON.parse(localStorage.getItem('trinetra_parties')) || [];

window.onload = () => {
    const page = document.body.getAttribute('data-page');
    if (page === 'parties') renderParties();
};

function addParty() {
    const name = document.getElementById('pName').value;
    const gst = document.getElementById('pGst').value;
    const phone = document.getElementById('pPhone').value;

    if (name === "") {
        alert("Error: Party Name is Required");
        return;
    }

    const newParty = {
        id: Date.now(),
        name: name,
        gst: gst || 'N/A',
        phone: phone || 'N/A'
    };

    parties.push(newParty);
    saveAndRefresh();
}

function deleteParty(id) {
    if (confirm("Are you sure you want to delete this party?")) {
        parties = parties.filter(p => p.id !== id);
        saveAndRefresh();
    }
}

function saveAndRefresh() {
    localStorage.setItem('trinetra_parties', JSON.stringify(parties));
    renderParties();
    
    // Reset Input Fields
    document.getElementById('pName').value = '';
    document.getElementById('pGst').value = '';
    document.getElementById('pPhone').value = '';
}

function renderParties() {
    const list = document.getElementById('partyList');
    if (!list) return;

    if (parties.length === 0) {
        list.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px;">No Records Found</td></tr>';
        return;
    }

    list.innerHTML = parties.map(p => `
        <tr>
            <td><strong>${p.name}</strong></td>
            <td>${p.gst} <br> <small>${p.phone}</small></td>
            <td>
                <button onclick="deleteParty(${p.id})" style="background:#c0392b; border:none; color:white; padding:5px; width:40px; border-radius:4px;">DEL</button>
            </td>
        </tr>
    `).join('');
}
