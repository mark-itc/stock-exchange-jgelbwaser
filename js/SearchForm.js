
class SearchForm {

    static apiUrlStart = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=';
    static apiUrlEnd = '&amp;limit=10&amp;exchange=NASDAQ';
    static apiUrlCompany = 'https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/';
    static defautDebounceDelay = 500;
    static apiLimitCompanySymbQty = 3;

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
        this.searchInput.addEventListener('input', (event) => {
            var refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?query=' + event.currentTarget.value;
            window.history.pushState({ path: refresh }, '', refresh);
            this.debouncedSubmitForm();
        });
        this.searchTerm = this.getQueryUrlParam();
        if (this.searchTerm) {
            this.searchInput.value = this.searchTerm
            this.submitForm()
        };
    }


    getQueryUrlParam() {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('query');
        return query;
    }


    debouncedSubmitForm = this.debounce(() => {
        this.submitForm()
    });


    debounce(cb, delay = SearchForm.defautDebounceDelay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                cb(...args);
            }, delay);
        }
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
        if (!this.searchTerm) {
            this.executeWithResults()
            return;
        }
        if (!this.searchTerm) return
        this.showLoadingStatus(true);
        const foundCompanies = await this.getSearchTermCompanies(this.searchTerm);

        if (this.symbolHasChanged(foundCompanies.searchTerm)) return
        this.executeWithResults(foundCompanies.data, this.searchTerm, true);
        this.showLoadingStatus(false);

        if (this.symbolHasChanged(foundCompanies.searchTerm)) return
        this.companies = await this.getAdditionalCompanyInfo(foundCompanies);

        if (this.symbolHasChanged(this.companies.searchTerm)) return;
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
        if (isLoading) {
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
        const data = await this.queryApiSearch(url);
        if (data.length > 10) data.length = 10; // max 10 results are displayed
        return { data: data, searchTerm: symbolToSearch };
    }

    async getAdditionalCompanyInfo(companies) {
        const symbolArray = companies.data.map((company) => {
            return company.symbol;
        });

        const moreData = await this.makeAPIArrayRequest(symbolArray);

        return { data: moreData, searchTerm: companies.searchTerm };
    }



    async queryApiSearch(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('response status:' + response.status);
            const data = await response.json();
            return data
        } catch (err) {
            console.log(err)
            return
        }
    }


    async makeAPIArrayRequest(symbolArray) {
        try {
            const apiArray = this.getApiCompanyUrlArray(symbolArray);
            const promises = [];
            let count = 0;

            for (const thisurl of apiArray) {
                const response = await fetch(thisurl);
                if (!response.ok) throw new Error('response status:' + response.status);
                promises.push(response.json());
            }
            const result = await Promise.all(promises).then((data) => data);
            
            let companyInfoArray = [];
            result.forEach((response)=>{
                if(response.companyProfiles) {
                    companyInfoArray = [...companyInfoArray, ...response.companyProfiles];
                } else {
                    companyInfoArray.push(response);
                }
            });
            
            return companyInfoArray;

        } catch (err) {
            console.log(err);
        }
    }

    getApiCompanyUrlArray(symbolArray) {
        const urlArray = [];

        while(symbolArray.length > 0) {
            const subArray = symbolArray.splice(0,SearchForm.apiLimitCompanySymbQty);
            const apiUrl = SearchForm.apiUrlCompany + subArray.join()
            urlArray.push(apiUrl);
        }
        return urlArray;
     }


}