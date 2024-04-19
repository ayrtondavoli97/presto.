//!prendere dei dati da una risorsa esterna

//? 1- fetch() -> collegarsi al json
//? 2- .then() -> estrarre dalla PROMISE il contenuto mediante il metodo .json()
//? 3- .then() -> dall'oggetto ottenuto effettuare delle operazioni.


fetch('../annunci.json')
    .then(response => response.json())
    .then(data => {    
        console.log(data) //array di oggetti

        //catturo il contenitore dei radio buttons
        let radioWrapper = document.querySelector('#radioWrapper');

        //catturo il contenitore delle card degli annunci
        let cardsWrapper = document.querySelector('#cardsWrapper');

        //catturo l'inputRange ed il paragrafo
        let inputRange = document.querySelector('#inputRange');
        let numberPrice = document.querySelector('#numberPrice');

        //catturo il campo wordInput
        let wordInput = document.querySelector('#wordInput');


        //creo la funzione per estrapolare le singole categorie
        function setCategory() {

            let uniqueCategories = [];

            data.forEach(annuncio => {
                if(!uniqueCategories.includes(annuncio.category)){
                    uniqueCategories.push(annuncio.category)
                }
            });

            uniqueCategories.forEach(category => {
                let div = document.createElement('div');
                div.classList.add('form-check');
                div.innerHTML = `
                <input class="form-check-input" type="radio" name="categories" id="${category}">
                <label class="form-check-label" for="${category}">
                    ${category}
                </label>
                `

                radioWrapper.appendChild(div);
            })
        }

        
        //creo le card degli annunci
        function createCards(array) {
            //ripulire il contenitore
            cardsWrapper.innerHTML = ``


            array.forEach(annuncio => {
                let div = document.createElement('div');
                div.classList.add('col-12', 'col-md-3' , 'my-2');
                div.innerHTML = `
                    <!-- annuncio -->
                    <div class="card" >
                    <!-- div che ci serve per delimitare quest'area ed aggiungere l'effetto zoom -->
                    <div class="position-relative overflow-hidden">
                    <a href="">
                    <img src="../img/property-1.jpg" class="card-img-top img-zoom" alt="...">
                    </a>
                    <!-- div che mostrerà la categoria -->
                    <div class="position-absolute bottom-0 start-0 bg-white rounded-top py-1 px-3 mx-3 text-category">
                    ${annuncio.category}
                    </div>
                    </div>
                    
                    <div class="card-body">
                        
                        <p class="text-price">
                        € ${annuncio.price}
                        </p>
                        <a href="#" class="text-decoration-none">
                        <h5 class="card-title">${annuncio.name}</h5>
                        </a>
                        </div>
                    </div>
                `
                
                cardsWrapper.appendChild(div)
            })
        }
        
        
        
        //filtro per categoria
        function filterByCategory(category) {
            if (category == 'All') {
                createCards(data)
            } else {
            let filtered = data.filter(annuncio => annuncio.category == category)
                createCards(filtered);
            }
        }

        //invochiamo le funzioni
        setCategory()
        createCards(data)


        //catturo tutti i radio buttons delle categorie
        let radioCategories = document.querySelectorAll('.form-check-input');
        radioCategories.forEach(radioButton=>{
            // console.log(radioButton.id)
            radioButton.addEventListener('click', ()=>{
                let category = radioButton.id;
                filterByCategory(category);
            })
        })


        //impostare il range del filtro per prezzo
        function setInputPrice() {
            //estrarre tutti i prezzi degli annunci
            let prices = data.map(annuncio => Number(annuncio.price))
            // console.log(prices);

            //? trovare il prezzo più alto e quello più basso
            //primo approccio
            // let maxPrice = Math.max(...prices);
            // let minPrice = Math.min(...prices);


            //secondo approccio
            prices.sort((a, b)=> a-b)
            let maxPrice = prices.pop();

            // prices.sort((a, b)=> b-a)
            // let minPrice = prices.pop();
            // console.log(maxPrice, minPrice);

            inputRange.max = maxPrice;
            inputRange.value = maxPrice;
            numberPrice.innerHTML = `${maxPrice} €`
        }

        setInputPrice()


        //funzione per filtrare per prezzo
        function filterByPrice(numero) {
            let filtered = data.filter( annuncio => Number(annuncio.price)<= Number(numero))
            createCards(filtered);
        }


        inputRange.addEventListener('input', ()=>{
            filterByPrice(inputRange.value);
            numberPrice.innerHTML = `${inputRange.value} €`
        })

        
        //funzione per filtrare per parola
        function filterByWord(word) {
            //la parola deve essere inclusa nel nome dell'annuncio
            let filtered = data.filter(annuncio=> annuncio.name.toLowerCase().includes(word.toLowerCase()));
            createCards(filtered);
        }

        wordInput.addEventListener('input', ()=>{
            setTimeout(()=>{
                filterByWord(wordInput.value);
            }, 1000)

        })





})