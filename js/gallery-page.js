//TEMPLATES
const results_template = document.getElementById('results-template')
const tag_template = document.getElementById('tag-template')
const photos_grid__item = document.getElementById('photos-grid__item-template')
const photos_grid__upload = document.getElementById('photos-grid__upload-template')


const search_bar__input = document.querySelector('[data-search-bar__input]')
const search_bar__recs = document.querySelector('[data-search-bar__recommendations]')
const search_bar__recs__conatiner = document.querySelector('[data-search-bar__recommendations__container]')

const tag_container = document.querySelector('[data-gallery__tag-container]')

const photos_grid = document.querySelector('[data-gallery__viewer__photos-grid]')

const uplaod = document.querySelector('[data-upload]')
const uplaod_input = document.querySelector('[data-upload__btn__file-input]')
const uplaod_close_btn = document.querySelector('[data-upload__close-btn]')


//const LOCAL_STORAGE_TAGS = 'gallery.tags'
//let tags = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TAGS)) || []

//TESTING...
let tags = [{id: 'ABSTRACT', name: 'Abstract'}, {id: 'ART', name: 'Art'}, {id: 'TEST', name: 'Test'}]
let chosen_tags = []
let photos = [{id: '1', tags: ['ABSTRACT', 'ART'], name: 'Test', src: 'images/Test.jpeg'}, {id: '2', tags: ['ART'], name: 'Test2', src: 'images/Test02.jpg'}]

let uploaded_file

//MAIN

render_gallery_viewer(chosen_tags)



//EVENTS
uplaod_close_btn.addEventListener('click', function(e) {
    uplaod.classList.add('upload--hide')
    //TODO: reset upload form 
})

uplaod_input.addEventListener('change', function(e) {
    uploaded_file = 'http://127.0.0.1:8887/' + e.target.value.split(/(\\|\/)/g).pop() 
})

uplaod.addEventListener('click', function(e) {  
    if(e.target.hasAttribute('data-upload__save-btn')) {
        if(uplaod_input.files.length == 1) {    
            photos.push(create_photo(Date.now.toString(), uploaded_file, ['TEST', 'ART']))
        }
        uplaod.classList.add('upload--hide')
        render_gallery_viewer(chosen_tags)
    } 
})

photos_grid.addEventListener('click', function(e) {
    if(e.target.hasAttribute('data-upload-a-photo')) {
        uplaod.classList.remove('upload--hide')
    }    
})

tag_container.addEventListener('click', function(e) {
    if(e.target.hasAttribute('data-tag__close-btn')) {
        const tag_p = e.target.parentElement.querySelector('[data-tag__txt]')
        remove_filter_by_id(tag_p.id)
        e.target.parentElement.remove()
        render_gallery_viewer(chosen_tags)
       //TODO: Tags filter changes and the photos that are being shown need to change
    }
})

search_bar__recs.addEventListener('mousedown', function(e){
    if(e.target.hasAttribute('data-search-bar__recommendations__item')) { 
        filter = get_tag_by_id(e.target.id)
        if(chosen_tags.filter(function(e) { return e.id === filter.id }).length < 1) {    
            chosen_tags.push(filter)
            const tag = document.importNode(tag_template.content, true)
            const tag_p = tag.querySelector('[data-tag__txt]')   
            tag_p.id = filter.id
            tag_p.innerText = filter.name
            tag_container.appendChild(tag)
            render_gallery_viewer(chosen_tags)
        }
    }
})

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

function create_photo(photo_name, path, photo_tags) {
            //{id: '1', tags: ['ABSTRACT', 'ART'], name: 'Test', src: 'images/Test.jpeg'}
    return { id: Date.now().toString(), tags: photo_tags, name: photo_name, src: path }
}

//TODO: better system for search results is needed
function render_search_results(filter) {
    clear_element(search_bar__recs__conatiner)
    if(!is_empty_or_spaces(filter)) {
        
        for (i = 0; i < tags.length; i++) {
            if (tags[i].name.toUpperCase().indexOf(filter) > -1) {
                
                const result = document.importNode(results_template.content, true)
                const result_p = result.querySelector('[data-search-bar__recommendations__item]')   
                result_p.id = tags[i].id
                result_p.innerText = tags[i].name
                search_bar__recs__conatiner.appendChild(result)

                found_smth = true
            }
        }

        if(!found_smth) { search_bar__recs.style.display = '' } 
        else { search_bar__recs.style.display = 'block' }
    }
    else {
        for (i = 0; i < tags.length; i++) {
            const result = document.importNode(results_template.content, true)
            const result_p = result.querySelector('[data-search-bar__recommendations__item]')   
            result_p.id = tags[i].id
            result_p.innerText = tags[i].name
            search_bar__recs__conatiner.appendChild(result)
        }
    }
}

function render_gallery_viewer(filters) {
    clear_element(photos_grid)

    const upload = document.importNode(photos_grid__upload.content, true)
    photos_grid.appendChild(upload)

    for (let i = 0; i < photos.length; i++) {
        if(check_tags(photos[i], filters)) {
            const item = document.importNode(photos_grid__item.content, true)
            const item_img = item.querySelector('[data-photos-grid__img]')   
            item.id = photos[i].id
            item_img.src = photos[i].src
            photos_grid.appendChild(item)
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

function get_tag_by_id(id) {
    for (i = 0; i < tags.length; i++) {
        if (tags[i].id == id) { return tags[i] }
    }
}


function remove_filter_by_id(id) {
    for (i = 0; i < chosen_tags.length; i++) {
        if (chosen_tags[i].id == id) { 
            chosen_tags.splice(i, 1);
        }
    }
}

function check_tags(img, filters) {
    if(filters.length < 1) { return true }
    let matched = false
    for (let i = 0; i < img.tags.length; i++) {
        for (let j = 0; j < filters.length; j++) {
            if(img.tags[i] === filters[j].id) { matched = true }
        }   
    }
    return matched
}
