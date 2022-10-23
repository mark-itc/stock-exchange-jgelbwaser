
class SearchForm {

    static apiUrlStart = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=';
    static apiUrlEnd = '&amp;limit=10&amp;exchange=NASDAQ';
    static apiUrlCompany = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/';
   
    constructor(formContainer) {
        this.loadForm(formContainer);
    }

    loadForm(formContainer) {        
        this.form = this.getFormHTML();
        formContainer.appendChild(this.form);
        this.searchButton = document.getElementById('search-button');
        this.searchInput = document.getElementById('search-term');
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.submitForm();
        });
        this.searchInput.addEventListener('input', (event)=> {
                if(event.currentTarget.value != '') {
                    this.submitForm();
                }
        })
    }
    
    getFormHTML() {
        const form = document.createElement('form');
        form.innerHTML = `    
            <div class="input-group">
            <input type="text" id="search-term" class="form-control" placeholder="Search for company stock symbol" aria-label="Recipient's username"
            aria-describedby="basic-addon2">
            <div class="input-group-append">
            <button id="search-button" class="btn btn-primary" type="submit">
            <span id="search-spinner" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Search</button>
            </div>
        `;
        return form;      
    }

    async submitForm() {
        this.searchTerm = document.getElementById('search-term').value;
        if(!this.searchTerm) return
        this.showLoadingStatus(true);
        const foundCompanies = await this.getSearchTermCompanies(this.searchTerm);
        
        if(this.symbolHasChanged(foundCompanies.searchTerm)) return
        this.executeWithResults(foundCompanies.data, this.searchTerm, true);
        this.showLoadingStatus(false);
        if(this.symbolHasChanged(foundCompanies.searchTerm)) return
        this.companies = await this.getAdditionalCompanyInfo(foundCompanies);
        
        if(this.symbolHasChanged(this.companies.searchTerm)) return;
        this.executeWithResults(this.companies.data, this.searchTerm, false);
        
    }

    symbolHasChanged(searchTermUsed) {
        if (searchTermUsed == this.searchTerm) {
            return false
        } else {
            return true
        }
    }

    showLoadingStatus(isLoading) {
        if(isLoading) {
            this.searchButton.classList.add('loading');
        } else {
            this.searchButton.classList.remove('loading');
        }
    }

    onSearch(customFunction) {
        this.executeWithResults = customFunction;
    }

    async getSearchTermCompanies(symbolToSearch) {
            const url = SearchForm.apiUrlStart + symbolToSearch + SearchForm.apiUrlEnd;
            const data = await this.makeAPIrequest(url);
            if(data.length > 10) data.length = 10; // max 10 results are displayed
            return {data:data, searchTerm:symbolToSearch};
    }

    async getAdditionalCompanyInfo(companies) {
            const urlCompaniesArray = companies.data.map((company) => {
                return SearchForm.apiUrlCompany + company.symbol;
            });
            const moreData = await this.makeAPIArrayRequest(urlCompaniesArray);

            return   {data:moreData, searchTerm:companies.searchTerm};

    }

    async makeAPIrequest(url) {
        let urlsArray = []
        if (!Array.isArray(url)) {
            urlsArray = [url];
        } else {
            urlsArray = url;
        }  
        const resultArray = await this.makeAPIArrayRequest(urlsArray);
        return resultArray[0];
    }
    
    
//    async NEWmakeAPIArrayRequest(urlsArray) {

//     let count = 0;

//     const responses = await Promise.all(
//         urlsArray.map(async url => {
//             console.log(++count);
//             const res = await fetch(url); // Send request for each id           
//         })
//     );

//     const results = await Promise.all(
//         responses.map(async response => {
//             const res = await response.json(); // Send request for each id           
//         })
//     );

//     return results;

//    }
   
   
    async makeAPIArrayRequest(urlsArray) {
        try {
            const promises = [];
            let count = 0;
            
            for( const thisurl of urlsArray )  {
                const response = await fetch(thisurl);
                //console.log('fetch call no:', ++count);
                if(!response.ok) throw new Error('response status:' + response.status);
                promises.push(await response.json());
            }
            const result = Promise.all(promises).then((data) =>  data);

            return result;

        } catch(err) {
            console.log(err);
        }

    }


}