// https://wolnelektury.pl/api/epochs/?format=json

lista = document.querySelector('#lista');
radios = Array.from(document.querySelectorAll('input[type="radio"]'));
for (element of radios){
    element.onchange = function(e){
        updateDisplay(e.target.value);
    };
}



function updateDisplay(name){
    // if there's something in #lista list, remove it all first
    while (lista.firstChild) lista.removeChild(lista.firstChild);

    url = 'https://wolnelektury.pl/api/' + name + '/?format=json';
    fetch(url)
    .then(response => response.json())
    .then(data => {
        for (element of data){
            kontent = "";

            // first if is meant only for the books endpoint
            if (element.title && element.author) 
                kontent = "Tytuł: <b>" + element.title + "</b>.<br>  Autor: <em>" + element.author + "</em>" 
                + "<br>" + "<a target='_blank' href='"+ element.url + "'>" + "Czytaj</a>";

            // this if is meant only for the collections endpoint
            else if (element.title && !element.name) 
                kontent = element.title;

            // this is the rest of the endpoints
            else 
                kontent = element.name;
            
            li = document.createElement("li");
            li.innerHTML = kontent; 
            lista.appendChild(li);
        }
        
    });
}

updateDisplay('epochs');