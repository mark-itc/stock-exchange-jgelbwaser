
class SearchResult {

    constructor(resultContainer) {
        this.resultsListHTML = this.getlistHTML();
        resultContainer.appendChild(this.resultsListHTML);
    }

    renderResults(companies, searchTerm) {
        let resultsHTML = '';
        companies.forEach( company => {
            resultsHTML += this.getlistItemHTMLnew(company, searchTerm);
        });

        this.resultsListHTML.innerHTML = resultsHTML;
    }

    getlistHTML() {
        let list = document.createElement('div');
        list.classList.add('list-group', 'list-group-flush');
        return list;
    }


    getlistItemHTMLnew (company, searchTerm) {
        let redClassIfNegative = '';
        const nameWhithTermTag = this.instertSearchTermTag(company.profile.companyName, searchTerm);
        const symbolWhithTermTag = this.instertSearchTermTag(company.symbol, searchTerm);
        const changeInPercent = parseFloat(company.profile.changesPercentage).toFixed(2)
        if (changeInPercent < 0) { redClassIfNegative = 'red'; }
        return  `<a href="/company.html?symbol=${company.symbol}" class="list-group-item list-group-item-action">
        <div class="d-flex align-items-center">
        <img  class="li-company-logo" src="${company.profile.image}" alt="">
        <span class="li-company-name text-primary"> ${nameWhithTermTag}</span>
        <span class="li-company-symbol">(${symbolWhithTermTag })</span> 
        <span class="li-company-change comp-change ${redClassIfNegative}">${changeInPercent}</span>  
        </div>
        </a>`;
    }

     instertSearchTermTag(string, searchTerm) {

        const openingTag = '<span class="search-term">';
        const closingTag = '</span>';
        const regEx = new RegExp(searchTerm, "i");;
        const index = string.search(regEx);
    
            if(index > -1) {
    
                const stringBeforeTerm = string.slice(0,index);
                const stringTerm = string.slice(index, index + searchTerm.length);
                const stringAfterTerm =  string.slice(index + searchTerm.length)
    
                string = stringBeforeTerm + openingTag + stringTerm + closingTag + stringAfterTerm;
            }
    
        return string;
    
    
    }

}