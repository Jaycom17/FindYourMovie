/**
 * Estados que puede retornar la conexion a la API
 */
const Status = {
    OK: 200,
    ERROR: 404,
    KEY_ERROR: 401
}

const state ={
    MOVIE : 0,
    MOVIEGENDER:1,
    SERIE:2,
    SERIEGENDER:3
}

let activeGender = "";
let year = "";

var statusPage = state.MOVIE;

const searchButton = document.querySelector('#search-button');
const minYear = document.querySelector('#min-year');
const maxYear = document.querySelector('#max-year');
const nextbutton = document.querySelector('#next-button');
const prevbutton = document.querySelector('#previus-button');

let moviePage=1;
let SeriePage=1;

function quitarSeleccion(prmItem, list){
    list.forEach(item => {
        if(item != prmItem){
            item.classList.remove('active');
        }
    });
}

function checkYearInput(prmMinYear, prmMaxYear){
    if(prmMinYear >= prmMaxYear){ 
        return prmMaxYear-1;
    }
    return prmMinYear;
}

const getInfoMovie = (id) =>{
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=3c02078ec316ec069c4acfb3361e6986&language=es-MX`).then(respuesta => {
        if(respuesta.ok){
            return respuesta.json();
        }else{
            return respuesta.status;
        }
    }).then(data => {
        if(data === Status.ERROR){
            console.log("Error relacionado con la llave");
        }else if(data === Status.KEY_ERROR){
            console.log("Error, la pelicula no se encuentra");
        }else{
            /** hay qeu revisar que hacer */
            let modal= `<section id="modal-info">
                            <h3 class="modal-title">${data.title}</h3>
                            <p class="modal-description">${data.overview}</p>
                            <button id="close-modal">Cerrar</button>
                        </section>`;
            
            document.querySelector(".movie").innerHTML = "";
            document.querySelector(".movie-serie").innerHTML = modal;
            
            const modalShow = document.querySelector("#modal-info");

            modalShow.showModal();

            const closerModal = document.querySelector("#close-modal");
            closerModal.addEventListener('click', () => {
                modalShow.close();
            });

            modalShow.addEventListener('close', () => {
                console.log("cerro");
                modalShow.remove();
            });
        }
    });

}

const cargarPeliculas = () =>{
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=3c02078ec316ec069c4acfb3361e6986&language=es-MX&page=${moviePage}`).then(respuesta => {
        if(respuesta.ok){
            return respuesta.json();
        }else{
            return respuesta.status;
        }
    }).then(data => {
        if(data === Status.ERROR){
            console.log("Error relacionado con la llave");
        }else if(data === Status.KEY_ERROR){
            console.log("Error, la pelicula no se encuentra");
        }else{
            let peliculas = '';
            data.results.forEach(pelicula => {
                peliculas += 
                `<article value="${pelicula.id}" class="item">
                    <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" alt="poster_id">
                    <h3 class="title">${pelicula.title}</h3>
                </article>`
                ;
            });

            document.querySelector('#movie-serie').innerHTML = peliculas;

            const items = document.querySelectorAll(".item");
            console.log(items);
            items.forEach((item) => {
                item.addEventListener('click', () => {
                    const id = item.getAttribute('value');
                    getInfoMovie(id);
                });
            });
        }
    });
    
}

const cargarPeliculasConGender = (gender, year) =>{

    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=3c02078ec316ec069c4acfb3361e6986&page=1&primary_release_year=${year}&with_genres=${gender}&page=${moviePage}`).then(respuesta => {
        if(respuesta.ok){
            return respuesta.json();
        }else{
            return respuesta.status;
        }
    }).then(data => {
        if(data === Status.ERROR){
            console.log("Error relacionado con la llave");
        }else if(data === Status.KEY_ERROR){
            console.log("Error, la pelicula no se encuentra");
        }else{
            let peliculas = '';
            data.results.forEach(pelicula => {
                peliculas += 
                `<article value=${pelicula.id} class="item" href="#">
                    <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" alt="poster_id">
                    <h3 class="title">${pelicula.title}</h3>
                </article>`
                ;
            });

            document.querySelector('#movie-serie').innerHTML = peliculas;
        }
    });
    
}

const getGendersMovie = () =>{
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=3c02078ec316ec069c4acfb3361e6986&language=es-MX`).then(respuesta => {
        if(respuesta.ok){
            return respuesta.json();
        }else{
            return respuesta.status;
        }
    }).then(data => {
        if(data === Status.ERROR){
            console.log("Error relacionado con la llave");
        }else if(data === Status.KEY_ERROR){
            console.log("Error, la pelicula no se encuentra");
        }else{
            let generos = "";
            const genders = document.querySelector('#genders-options');
            genders.innerHTML = "";
            data.genres.forEach(genero => {
                generos += `<button class="gender-button" value="${genero.id}">${genero.name}</button>`;
            });
            genders.innerHTML = generos;

            let actualMinYear;

            maxYear.addEventListener('change', () => {
                actualMaxYear = minYear.value;
                minYear.value = checkYearInput(minYear.value, maxYear.value);
            });

            minYear.addEventListener('change', () => {
                actualMinYear = checkYearInput(minYear.value, maxYear.value);
                minYear.value = actualMinYear;
            });

            const genderButtons = document.querySelectorAll('.gender-button');
            genderButtons.forEach(genderButton => {
                genderButton.addEventListener('click', () => {
                    genderButton.classList.toggle('active');
                    if(genderButton.classList.contains('active')){
                        activeGender = genderButton.value;
                        quitarSeleccion(genderButton, genderButtons);
                    }
                });
            });
            
            searchButton.addEventListener('click', () => {
                if(activeGender){
                    statusPage = state.MOVIEGENDER;
                    year = Math.floor(Math.random() *  (parseInt(maxYear.value) - parseInt(minYear.value) + 1)) + parseInt(minYear.value);
                    cargarPeliculasConGender(activeGender,year);
                    moviePage=1;
                }
            });
        }
    });
}

/**Seccion para las series */
//--------------------------------
const cargarSeries = () =>{

    fetch(`https://api.themoviedb.org/3/tv/popular?api_key=3c02078ec316ec069c4acfb3361e6986&language=es-MX&page=${SeriePage}`).then(respuesta => {
        if(respuesta.ok){
            return respuesta.json();
        }else{
            return respuesta.status;
        }
    }).then(data => {
        if(data === Status.ERROR){
            console.log("Error relacionado con la llave");
        }else if(data === Status.KEY_ERROR){
            console.log("Error, la serie no se encuentra");
        }else{
            let series = '';
            data.results.forEach(serie => {
                series += 
                `<article value=${serie.id} class="item" href="#">
                    <img class="poster" src="https://image.tmdb.org/t/p/w500/${serie.poster_path}" alt="poster_id">
                    <h3 class="title">${serie.name}</h3>
                </article>`
                ;
            });

            document.querySelector('#movie-serie').innerHTML = series;
        }
    });
    
}

const cargarSeriesConGender = (gender, year) =>{

    fetch(`https://api.themoviedb.org/3/discover/tv?api_key=3c02078ec316ec069c4acfb3361e6986&page=1&first_air_date_year=${year}&with_genres=${gender}&page=${SeriePage}`).then(respuesta => {
        if(respuesta.ok){
            return respuesta.json();
        }else{
            return respuesta.status;
        }
    }).then(data => {
        if(data === Status.ERROR){
            console.log("Error relacionado con la llave");
        }else if(data === Status.KEY_ERROR){
            console.log("Error, la pelicula no se encuentra");
        }else{
            let series = '';
            data.results.forEach(serie => {
                series += 
                `<article value=${serie.id} class="item" href="#">
                    <img class="poster" src="https://image.tmdb.org/t/p/w500/${serie.poster_path}" alt="poster_id">
                    <h3 class="title">${serie.name}</h3>
                </article>`
                ;
            });

            document.querySelector('#movie-serie').innerHTML = series;
        }
    });
    
}

const getGendersSerie = () =>{
    fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=3c02078ec316ec069c4acfb3361e6986&language=es-MX`).then(respuesta => {
        if(respuesta.ok){
            return respuesta.json();
        }else{
            return respuesta.status;
        }
    }).then(data => {
        if(data === Status.ERROR){
            console.log("Error relacionado con la llave");
        }else if(data === Status.KEY_ERROR){
            console.log("Error, la pelicula no se encuentra");
        }else{
            let generos = "";
            const genders = document.querySelector('#genders-options');
            genders.innerHTML = "";
            data.genres.forEach(genero => {
                generos += `<button class="gender-button" value="${genero.id}">${genero.name}</button>`;
            });
            genders.innerHTML = generos;

            let actualMinYear;

            maxYear.addEventListener('change', () => {
                actualMaxYear = minYear.value;
                minYear.value = checkYearInput(minYear.value, maxYear.value);
            });

            minYear.addEventListener('change', () => {
                actualMinYear = checkYearInput(minYear.value, maxYear.value);
                minYear.value = actualMinYear;
            });

            const genderButtons = document.querySelectorAll('.gender-button');
            genderButtons.forEach(genderButton => {
                genderButton.addEventListener('click', () => {
                    genderButton.classList.toggle('active');
                    if(genderButton.classList.contains('active')){
                        activeGender = genderButton.value;
                        quitarSeleccion(genderButton, genderButtons);
                    }
                });
            });
            
            searchButton.addEventListener('click', () => {
                if(activeGender){
                    statusPage = state.SERIEGENDER;
                    year = Math.floor(Math.random() *  (parseInt(maxYear.value) - parseInt(minYear.value) + 1)) + parseInt(minYear.value);
                    cargarSeriesConGender(activeGender,year);
                    SeriePage = 1;
                }
            });
        }
    });
}

cargarPeliculas();
getGendersMovie();

const movieSerie = document.querySelectorAll('.movie-serie');

movieSerie.forEach(item => {
    item.addEventListener('click', () => {
        item.classList.add('active');
        quitarSeleccion(item, movieSerie);
        if(item.id=="movies"){
            statusPage = state.MOVIE;
            cargarPeliculas();
            getGendersMovie();
        }else{
            statusPage = state.SERIE;
            cargarSeries();
            getGendersSerie();
        }
    });
});

prevbutton.addEventListener('click', () => {
    switch(statusPage){
        case state.MOVIE:
            if(moviePage>1){
                moviePage--;
            }
            cargarPeliculas();
            break;
        case state.MOVIEGENDER:
            if(moviePage>1){
                moviePage--;
            }
            cargarPeliculasConGender(activeGender,year);
            break;
        case state.SERIE:
            if(SeriePage>1){
                SeriePage--;
            }
            cargarSeries();
            break;
        case state.SERIEGENDER:
            if(SeriePage>1){
                SeriePage--;
            }
            cargarSeriesConGender(activeGender,year);
            break;
    }
});

nextbutton.addEventListener('click', () => {
    switch(statusPage){
        case state.MOVIE:
            moviePage++;
            cargarPeliculas();
            break;
        case state.SERIE:
            SeriePage++;	
            cargarSeries();
            break;
        case state.MOVIEGENDER:
            moviePage++;
            cargarPeliculasConGender(activeGender,year);
        case state.SERIEGENDER:
            SeriePage++;
            cargarSeriesConGender(activeGender,year);
    }
});