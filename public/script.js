
const search = document.getElementById('search');
const cryptoTableBody = document.getElementById('crypto-table');

async function fetchCryptoData() {
    try {
        const apiKey = 'CG-xAhYequZD7Ymk9eKnpC5xMUo';
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&api_key=${apiKey}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch cryptocurrency data');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cryptocurrency data:', error.message);
        return []; // Return an empty array in case of error
    }
}

function displayCryptoData(data) {
    cryptoTableBody.innerHTML = ''; 
    data.forEach(crypto => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${crypto.name} (${crypto.symbol.toUpperCase()})</td>
            <td>$${crypto.current_price.toFixed(2)}</td>
            <td>$${crypto.market_cap.toLocaleString()}</td>
            <td class="${crypto.price_change_percentage_24h < 0 ? 'text-danger' : 'text-success'}">${crypto.price_change_percentage_24h.toFixed(2)}%</td>
        `;

        cryptoTableBody.appendChild(row);
    });
}

function filterCryptoData(data, searchTerm) {
    return data.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm) ||
        crypto.symbol.toLowerCase().includes(searchTerm)
    );
}

search.addEventListener('input', async () => {
    const searchTerm = search.value.trim().toLowerCase();
    const data = await fetchCryptoData();
    const filteredData = filterCryptoData(data, searchTerm);
    displayCryptoData(filteredData);
});

window.addEventListener('DOMContentLoaded', async () => {
    const data = await fetchCryptoData();
    displayCryptoData(data);
});
const flipper = document.getElementById('flipper');
const flipToRegister = document.getElementById('flipToRegister');
const flipToLogin = document.getElementById('flipToLogin');

flipToRegister.addEventListener('click', () => {
    flipper.classList.add('flip');
});

flipToLogin.addEventListener('click', () => {
    flipper.classList.remove('flip');
});