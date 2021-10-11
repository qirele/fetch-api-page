// https://wolnelektury.pl/api/epochs/?format=json

let lista = document.querySelector('#json-output');
let loader = document.querySelector('.loader');
let radios = Array.from(document.querySelectorAll('input[type="radio"]'));
let pageButtonsNav = document.querySelector('#pageNumbers');


for (element of radios){
    element.onchange = function(e){
        fetchAndUpdate(e.target.value);
    };
}


function fetchAndUpdate(endpoint){
    // if there's something in #lista list, remove it all first
    while (lista.firstChild) lista.removeChild(lista.firstChild);
    while (pageButtonsNav.firstChild) pageButtonsNav.removeChild(pageButtonsNav.firstChild);

    url = 'https://wolnelektury.pl/api/' + endpoint + '/?format=json';

    fetch(url)
    .then(response => response.json())
    .then(data => {
        let paginatedItems = sliceData(data)
        for (let i = 0; i < paginatedItems.length; i++){
            let btn = document.createElement('button');
            btn.addEventListener('click', function(){
                updateDisplay(paginatedItems[i]); // when user clicks a button, the appropriate data will show itself to the user on the document.
            });
            btn.innerText = i + 1;
            pageButtonsNav.appendChild(btn);
        }
        updateDisplay(paginatedItems[0]); // show the first page instantly without waiting for a click
    });
}

function updateDisplay(data){
    while (lista.firstChild) lista.removeChild(lista.firstChild);
    for (element of data){
        li = document.createElement("li");
        li.innerHTML = generateDescription(element); 
        lista.appendChild(li);
    }
}

// search-filter logic
let searchInput = document.querySelector('#search-filter');
searchInput.addEventListener('keyup', function() {
    let term = searchInput.value.toLowerCase();
    let items = document.querySelectorAll('#json-output li');
    for (li of items){
        let item = li.innerHTML.toLowerCase();
        console.log(item);
        if (item.indexOf(term) == -1)
            li.classList.add('hide');
        else
            li.classList.remove('hide');

            
    }
    
});




fetchAndUpdate('epochs');

function sliceData(data){
    let chunk = 100;
    let slicedData = [];
    for (let i = 0, j = data.length; i < j; i += chunk){
        slicedData.push(data.slice(i, i + chunk));
    }
    return slicedData;
}

function generateDescription(element){
    let kontent = "";
    if (element.title && element.author) // first if is meant only for the books endpoint
        kontent = 
        `Tytuł: <b>${element.title}</b><br>
        Autor: <em>${element.author}</em><br>
        <a target='_blank' href='${element.url}'>Czytaj</a>`;
    else if (element.title && !element.name) // this if is meant only for the collections endpoint
        kontent = element.title;
    else // this is the rest of the endpoints
        kontent = element.name;
    return kontent;
}

/*  make that many buttons as there are items in slicedData() function return, and on
    each of that button when clicked, it should update the display to display the page that corresponds to button's number */

