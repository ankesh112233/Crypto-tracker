const options = { 
    method: 'GET',
     headers: { 
        accept: 'application/json', 'x-cg-demo-api-key': 'CG-mDVVqLm5xBDjvcVq523LnAmB' }, };


        const getFavorites = () => JSON.parse(localStorage.getItem('favorites')) || [];


const saveFavorites = (favorites) => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}        

const toggleFavorite = (coinId) => {
    let favorites = getFavorites();
    if(favorites.includes(coinId)) {
        favorites = favorites.filter(id => id !== coinId);
    }else{
        favorites.push(coinId);
    }
    saveFavorites(favorites);
    fetchFavoriteCoins();
}


const fetchFavoriteCoins = async () => {
    const favorites = getFavorites();
    const tableBody = document.querySelector('#Favorite-table tbody');
    const noFavoritesMessage = document.querySelector('#no-favorites');

    if(favorites.length === 0) {
        noFavoritesMessage.style.display = 'block';
        tableBody.innerHTML = '';
        return;
    }else{
        noFavoritesMessage.style.display = 'none';
    }
}


    try{
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${favorites.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
        if(!response.ok) 
            throw new Error("Network response was not ok");


            const data = await response.json();
            if(!data || data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="7">No favorite coins found</td></tr>';
                return;
            }
            renderFavorites(data)
    }catch(err) {
        console.error('Error fetching favorite coins:', err);
        
        tableBody.innerHTML = '<tr><td colspan="7">Error fetching favorite coins</td></tr>';
    }
;

 const renderFavorites = (coins) => {
    const tableBody = document.querySelector('#Favorite-table tbody');
    tableBody.innerHTML = '';

    coins.forEach((coin, index) => {
        const row = document.createElement('tr');
        row.classList.add('coin-row');
        row.dataset.coinId = coin.id;
        
        row.innerHTML = `
        <td>${index + 1}</td>
        <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24" /></td>
        <td>${coin.name}</td>
        <td>$${coin.current_price.toLocaleString()}</td>
        <td>$${coin.total_volume.toLocaleString()}</td>
        <td>$${coin.market_cap.toLocaleString()}</td>
        <td><i class="fas fa-trash remove-icon" data-id="${coin.id}" style="cursor: pointer; color:red;"></i></td>`;
        tableBody.appendChild(row);


    });

    document.querySelectorAll('.remove-icon').forEach(icon => {
        icon.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleFavorite(event.target.dataset.id);
    });
    document.querySelectorAll('.coin-row').forEach(row => {
        row.addEventListener('click', (event) => {
            if(event.target.classList.contains('remove-icon')) {
                const coinId = row.dataset.coinId;
                window.location.href = `coin.html?Id=${coinId}`;
            }
        });
    });

});
};

document.addEventListener('DOMContentLoaded', fetchFavoriteCoins);