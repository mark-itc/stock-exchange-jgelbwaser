console.log('SearchResult.js loaded');

class SearchResult {

    constructor(resultContainer) {
        this.resultsListHTML = this.getlistHTML();
        resultContainer.appendChild(this.resultsListHTML);
    }

    renderResults(companies) {
        console.log('RenderResults:', companies);
        let resultsHTML = '';
        companies.forEach( company => {
            resultsHTML += this.getlistItemHTML(company)
        });
        console.log(resultsHTML);
        this.resultsListHTML.innerHTML = resultsHTML;
    }

    getlistHTML() {
        let list = document.createElement('div');
        list.classList.add('list-group', 'list-group-flush');
        return list;
        // return  `<div class="list-group list-group-flush">
        //         </div>`;
    }

    getlistItemHTML(company) {
        return  `<a href="/company.html?symbol=${company.symbol}" class="list-group-item list-group-item-action">
        <span class="li-company-name">${company.name}</span>
        <span class="li-company-symbol">${company.symbol}</span>  
        </a>`;
    }

}