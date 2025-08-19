// Elementos da Vitrine
const vitrineContainer = document.getElementById('vitrine-container');
const charactersGrid = document.getElementById('charactersGrid');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const paginationElement = document.getElementById('pagination');

// Elementos de Detalhes
const detailContainer = document.getElementById('detail-container');
const characterDetail = document.getElementById('characterDetail');
const detailLoading = document.getElementById('detailLoading');
const detailError = document.getElementById('detailError');

let currentPage = 1;
let totalPages = 1;

// Função para mostrar vitrine
function showVitrine() {
    vitrineContainer.classList.remove('hidden');
    detailContainer.classList.add('hidden');
    window.location.hash = ''; // Limpa o hash
}

// Função para mostrar detalhes
function showDetail() {
    vitrineContainer.classList.add('hidden');
    detailContainer.classList.remove('hidden');
}

// Função principal que verifica o hash
function checkHash() {
    const hash = window.location.hash.replace("#", "");
    
    if (hash) {
        // Se tem hash, mostra os detalhes do personagem
        const characterId = Number(hash);
        if (characterId) {
            fetchCharacterDetails(characterId);
        }
    } else {
        // Se não tem hash, mostra a vitrine
        showVitrine();
    }
}

// Função para buscar personagens da vitrine
async function fetchCharacters(page = 1) {
    try {
        loadingElement.classList.remove('hidden');
        errorElement.classList.add('hidden');
        paginationElement.classList.add('hidden');
        
        const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar personagens');
        }
        
        const data = await response.json();
        displayCharacters(data.results);
        updatePagination(data.info);
        
    } catch (error) {
        showError(error.message);
    } finally {
        loadingElement.classList.add('hidden');
    }
}

// Função para exibir personagens na vitrine
function displayCharacters(characters) {
    charactersGrid.innerHTML = '';
    
    characters.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.className = 'character-card';
        characterCard.innerHTML = `
            <img src="${character.image}" alt="${character.name}" class="character-image">
            <div class="character-info">
                <h3 class="character-name">${character.name}</h3>
                <p class="character-species">${character.species}</p>
                <span class="character-status status-${character.status.toLowerCase()}">
                    ${character.status}
                </span>
            </div>
        `;
        
        // Clique redireciona para o hash (#id)
        characterCard.addEventListener('click', () => {
            window.location.hash = `#${character.id}`;
        });
        
        charactersGrid.appendChild(characterCard);
    });
}

// Função para buscar detalhes do personagem
async function fetchCharacterDetails(characterId) {
    try {
        showDetail();
        characterDetail.classList.add('hidden');
        detailLoading.classList.remove('hidden');
        detailError.classList.add('hidden');
        
        const response = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
        
        if (!response.ok) {
            throw new Error('Personagem não encontrado');
        }
        
        const character = await response.json();
        displayCharacterDetails(character);
        
    } catch (error) {
        showDetailError(error.message);
    } finally {
        detailLoading.classList.add('hidden');
    }
}

// Função para exibir detalhes do personagem
function displayCharacterDetails(character) {
    document.getElementById('detailImage').src = character.image;
    document.getElementById('detailName').textContent = character.name;
    document.getElementById('detailSpecies').textContent = character.species;
    document.getElementById('detailGender').textContent = character.gender;
    document.getElementById('detailLocation').textContent = character.location.name;
    
    const statusElement = document.getElementById('detailStatus');
    statusElement.textContent = character.status;
    statusElement.className = `character-status status-${character.status.toLowerCase()}`;
    
    characterDetail.classList.remove('hidden');
}

// Função para atualizar paginação
function updatePagination(info) {
    totalPages = info.pages;
    
    paginationElement.innerHTML = `
        <button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} class="pagination-btn">
            Anterior
        </button>
        
        <span class="page-info">Página ${currentPage} de ${totalPages}</span>
        
        <button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} class="pagination-btn">
            Próximo
        </button>
    `;
    
    paginationElement.classList.remove('hidden');
}

// Função para navegar entre páginas
function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    fetchCharacters(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Funções de erro
function showError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

function showDetailError(message) {
    detailError.textContent = message;
    detailError.classList.remove('hidden');
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verifica o hash inicial
    checkHash();
    
    // Carrega a vitrine se não houver hash
    if (!window.location.hash) {
        fetchCharacters(1);
    }
});

// Ouvinte para mudanças no hash
window.addEventListener('hashchange', checkHash);