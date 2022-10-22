
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
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.submitForm();
        });
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
        this.symbolInput = document.getElementById('search-term').value;
        if(!this.symbolInput) return
        this.showLoadingStatus(true);
        this.companies = await this.getSymbolCompanies(this.symbolInput);
        this.executeWithResults(this.companies, this.symbolInput);
        this.showLoadingStatus(false);
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

    async getSymbolCompanies(symbolToSearch) {
            const url = SearchForm.apiUrlStart + symbolToSearch + SearchForm.apiUrlEnd;
            const data = await this.makeAPIrequest(url);
            if(data.length > 10) data.length = 10; // max 10 results are displayed

            const urlCompaniesArray = data.map((company) => {
                return SearchForm.apiUrlCompany + company.symbol;
            });
            const moreData = await this.makeAPIArrayRequest(urlCompaniesArray);

            return moreData;

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
    
    
    async makeAPIArrayRequest(urlsArray) {
        try {
            const promises = [];


            for( const thisurl of urlsArray )  {
                const response = await fetch(thisurl);
                if(!response.ok) throw new Error('response status:' + response.status);
                promises.push(response.json());
            }
            const result = Promise.all(promises).then((data) =>  data);

            return result;

        } catch(err) {
            console.log(err);
        }

    }


}