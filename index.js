const options = { 
    method: 'GET',
     headers: { 
        accept: 'application/json', 'x-cg-demo-api-key': 'CG-mDVVqLm5xBDjvcVq523LnAmB' }, };


let coins = [];
let currentPage = 1;
const itemsPerPage = 25;

const fetchCoins = async (page) => { 
    try { 
        const response = await fetch( `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${itemsPerPage}&page=${page}`, options ); 
        coins = await response.json(); }
         catch (err) { console.error(err); }
          return coins; };

          const getFavorites = () => JSON.parse(localStorage.getItem('favorites')) || [];

          const saveFavorites = (favorites) => localStorage.setItem('favorites', JSON.stringify(favorites));

          const toggleFavorite = (coinId) => {
            let favorites = getFavorites();
            if(favorites.includes(coinId)) {
                favorites = favorites.filter(id => id !== coinId);
            }else{
                favorites.push(coinId);
            }
            saveFavorites(favorites);
            return favorites;
          }

          const handleFavoriteClick = (coinId, iconElement) => {
            const favorites = toggleFavorite(coinId);
            iconElement.classList.toggle('favorite', favorites.includes(coinId));
            
        }


          const renderCoinRow = (coin, index, start, favorites) => { 
            const isFavorite = favorites.includes(coin.id); 
            const row = document.createElement('tr');
             row.innerHTML = ` <td>${start + index}
             </td> 
             <td><img src="${coin.image}" alt="${coin.name}" width="24" height="24" /></td> 
             <td>${coin.name}</td> 
             <td>$${coin.current_price.toLocaleString()}</td> 
             <td>$${coin.total_volume.toLocaleString()}</td> 
             <td>$${coin.market_cap.toLocaleString()}</td> 
             <td> <i class="fas fa-star favorite-icon ${isFavorite ? 'favorite' : ''}" data-id="${coin.id}"></i> </td>`;
              return row; };

const renderCoins = (coinsToDisplay,page, itemsPerPage) => {
    const start = (page - 1) * itemsPerPage +1;
    const favorite = getFavorites();
    const tableBody = document.querySelector('#crypto-table tbody');
    if(!tableBody) {
        console.error('Table body not found');
        return;
        
    }
    tableBody.innerHTML = '';
    coinsToDisplay.forEach((coin, index) => {
        const row = renderCoinRow(coin, index, start, favorite);
        tableBody.appendChild(row);
    });
};

const initializePage = async () => {
     coins = await fetchCoins(currentPage);
     if(coins.length === 0) {
        console.error('No coins found');
        return;
     }
     renderCoins(coins, currentPage, itemsPerPage);
    };

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('favorite-icon')) {
            event.stopPropagation();
            const coinId = event.target.dataset.id;
            handleFavoriteClick(coinId,event.target);
        }
        const row = event.target.closest('.coin-row');
        if(row && !event.target.classList.contains('favorite-icon')) {
            const coinId = row.getAttribute('data-id');
            window.location.href = `coin.html?id=${coinId}`;
        }
    })


      const updatePaginationControls = ()=> {
        document.querySelector('#prev-button').disabled = currentPage === 1;
        document.querySelector('#next-button').disabled = coins.length < itemsPerPage;

      }


      const handlePrevButtonClick = async () => {
        if(currentPage > 1) {
            currentPage--;
            coins = await fetchCoins(currentPage);
            renderCoins(coins, currentPage, itemsPerPage);
            updatePaginationControls();
        }
      }

        const handleNextButtonClick = async () => {
            currentPage++;
            coins = await fetchCoins(currentPage);
            renderCoins(coins, currentPage, itemsPerPage);
            updatePaginationControls();
        };

        if(document.querySelector('#prev-button') && document.querySelector('#next-button')) {
            document.querySelector('#prev-button').addEventListener('click', handlePrevButtonClick);
            document.querySelector('#next-button').addEventListener('click', handleNextButtonClick);
        }
        



    let debounceTimeout;
    const debounce = (func, delay) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(func, delay);
    }

    const fetchSearchResults = async (query) => {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`, options);
            const data = await response.json();
            return data.coins;
        } catch (err) {
            console.error('Error fetching search results:', err);
        return[];
        }
    }   

    const showSearchResults = (results) => {
        const searchDialog = document.querySelector('#search-dialog');
        const resultList = document.querySelector('#search-results');

        resultList.innerHTML = '';

        if (results.length !== 0) {
            results.slice(0, 10).forEach(result=> {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                <img src="${result.image}" alt="${result.name}" width="24" height="24" /> 
                <span>${result.name}</span>
                `;
                listItem.dataset.id = result.id;
                resultList.append(listItem);

        })
    }else {
        resultList.innerHTML = '<li>No results found</li>';
    }

    resultList.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', (event) => {
            const coinId = event.currentTarget.dataset.id;
            window.location.href = `coin.html?id=${coinId}`;
        });

    });

    searchDialog.style.display = 'block';
}


const closeSearchDialog = () => {
    document.querySelector('#search-dialog').style.display = 'none';
}

    const handleSearchInput = ()=> {
        debounce(async () => {
            const searchTerm = document.querySelector('#search-box').value.trim();
            if(searchTerm) {
                const results = await fetchSearchResults(searchTerm);
                showSearchResults(results);
            }else {
                closeSearchDialog();
            }
        },300);
    }





document.addEventListener('DOMContentLoaded', initializePage);
document.querySelector('#search-box').addEventListener('input', handleSearchInput);
document.querySelector('#search-icon').addEventListener('click', handleSearchInput);
document.querySelector('#close-dialog').addEventListener('click', closeSearchDialog);