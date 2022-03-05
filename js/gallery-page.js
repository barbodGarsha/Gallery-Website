
const search_bar__input = document.querySelector('[data-search-bar__input]')
const search_bar__recs = document.querySelector('[data-search-bar__recommendations]')
const search_bar__recs__conatiner = document.querySelector('[data-search-bar__recommendations__container]')



//const LOCAL_STORAGE_TAGS = 'gallery.tags'
//let tags = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TAGS)) || []

//TESTING...
let tags = [{id: 'CATS', name: 'Cats'}, {id: 'DOGS', name: 'Dogs'}]


//EVENTS

search_bar__input.addEventListener('focus', function(e){
    search_bar__recs.style.display = 'block'
    render_search_results('')
})
  
search_bar__input.addEventListener('blur', function(e){
    search_bar__recs.style.display = ''
})

search_bar__input.addEventListener('input', function(e) {
    var filter, li, i, txtValue
    var found_smth = false
    filter = e.target.value.toUpperCase();
    render_search_results(filter)
    
})


//FUNCTIONS

function create_tag(name) {
    return { id: name.toUpperCase(), name: name}
}

//TODO: better system for search results is needed
function render_search_results(filter) {
    clear_element(search_bar__recs__conatiner)
    if(!is_empty_or_spaces(filter)) {
        
        for (i = 0; i < tags.length; i++) {
            if (tags[i].name.toUpperCase().indexOf(filter) > -1) {
                const result = document.createElement('p')
                result.dataset.listId = tags[i].id
                result.classList.add('search-bar__recommendations__item')
                result.innerText = tags[i].name
                search_bar__recs__conatiner.appendChild(result)
                
                found_smth = true
            } else {
            }
        }

        if(!found_smth) { search_bar__recs.style.display = '' } 
        else { search_bar__recs.style.display = 'block' }
    }
    else {
        for (i = 0; i < tags.length; i++) {
                const result = document.createElement('p')
                result.dataset.listId = tags[i].id
                result.classList.add('search-bar__recommendations__item')
                result.innerText = tags[i].name
                search_bar__recs__conatiner.appendChild(result)
        }
    }
}

function clear_element(element)
{
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

function is_empty_or_spaces(str){
    return str === null || str.match(/^ *$/) !== null;
}


