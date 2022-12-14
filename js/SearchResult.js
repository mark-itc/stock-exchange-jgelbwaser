
class SearchResult {

    constructor(resultContainer) {
        this.resultsListHTML = this.getListHTML();
        resultContainer.appendChild(this.resultsListHTML);
    }

    renderResults(companies, searchTerm, temp=false) {
        let resultsHTML = '';
        if(companies) {
            companies.forEach( company => {
                resultsHTML += this.getListItemHTML(company, searchTerm, temp);
            });
        }
        this.resultsListHTML.innerHTML = resultsHTML;
    }

    getListHTML() {
        let list = document.createElement('div');
        list.classList.add('list-group', 'list-group-flush');
        return list;
    }


    getListItemHTML (company, searchTerm, temp) {
        let changePercentClass = '';
        let changeInPercent = 'loading';  

        try {

            if(temp) {
                company.profile={};
                company.profile.companyName = company.name;
                company.profile.image ="";
                company.profile.changesPercentage=0; 
                changePercentClass = 'hide';       
            } else {
                 changeInPercent = parseFloat(company.profile.changesPercentage).toFixed(2)
                if (changeInPercent < 0) { changePercentClass = 'red'; }
    
            }
            const nameWhithTermTag = this.insertSearchTermTag(company.profile.companyName, searchTerm);
            const symbolWhithTermTag = this.insertSearchTermTag(company.symbol, searchTerm);
            return  `<a href="/company.html?query=${searchTerm}&symbol=${company.symbol}" class="list-group-item list-group-item-action">
            <div class="d-flex align-items-center">
            <img  class="li-company-logo" src="${company.profile.image}" alt="">
            <span class="li-company-name text-primary"> ${nameWhithTermTag}</span>
            <span class="li-company-symbol">(${symbolWhithTermTag })</span> 
            <span class="li-company-change comp-change ${changePercentClass}">${changeInPercent}</span>  
            </div>
            </a>`;
        } catch(er) {
            console.log(er);
        }
    }

     insertSearchTermTag(string, searchTerm) {

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