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
            resultsHTML += this.getlistItemHTMLnew(company)
        });

        this.resultsListHTML.innerHTML = resultsHTML;
    }

    getlistHTML() {
        let list = document.createElement('div');
        list.classList.add('list-group', 'list-group-flush');
        return list;
    }

    // getlistItemHTML(company) {
    //     return  `<a href="/company.html?symbol=${company.symbol}" class="list-group-item list-group-item-action">
    //     <span class="li-company-name">${company.name}</span>
    //     <span class="li-company-symbol">${company.symbol}</span>  
    //     </a>`;
    // }

    getlistItemHTMLnew (company) {
        let redClassIfNegative = '';
        const changeInPercent = parseFloat(company.profile.changesPercentage).toFixed(2)
        if (changeInPercent < 0) { redClassIfNegative = 'red'; }
        return  `<a href="/company.html?symbol=${company.symbol}" class="list-group-item list-group-item-action">
        <div class="d-flex align-items-center">
        <img  class="li-company-logo" src="${company.profile.image}" alt="">
        <span class="li-company-name text-primary">${company.profile.companyName}</span>
        <span class="li-company-symbol">(${company.symbol})</span> 
        <span class="li-company-change comp-change ${redClassIfNegative}">${changeInPercent}</span>  
        </div>
        </a>`;
    }

}