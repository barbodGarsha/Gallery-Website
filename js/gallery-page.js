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

const upload = document.querySelector('[data-upload]')
const upload_file_input = document.querySelector('[data-upload__btn__file-input]')
const upload_name_input = document.querySelector('[data-upload__name-input]')
const upload_close_btn = document.querySelector('[data-upload__close-btn]')
const upload_tag_container = document.querySelector('[data-upload__tag-container]')
const upload_search_bar__input = document.querySelector('[data-upload__search-bar__input]')
const upload_search_bar__recs = document.querySelector('[data-upload__search-bar__recommendations]')
const upload_search_bar__recs__conatiner = document.querySelector('[data-upload__search-bar__recommendations__container]')

const photo_viewer = document.querySelector('[data-photo-viewer]')
const photo_viewer__img = document.querySelector('[data-photo-viewer__img]')


//const LOCAL_STORAGE_TAGS = 'gallery.tags'
//let tags = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TAGS)) || []

//TESTING...
let tags = [{id: 'ABSTRACT', name: 'Abstract'}, {id: 'ART', name: 'Art'}, {id: 'TEST', name: 'Test'}]
let chosen_tags = []
let upload_chosen_tags = []
let photos = [{id: '1', tags: ['ART', 'ABSTRACT'], name: 'Test', src: 'images/Test.jpeg'}, {id: '2', tags: ['ART'], name: 'Test2', src: 'images/Test02.jpg'},]

let uploaded_file

//MAIN

render_gallery_viewer(chosen_tags)



//EVENTS
photo_viewer.addEventListener('click', function(e) {
    if(e.target === photo_viewer) { photo_viewer.classList.add('photo-viewer--hide') }
})

upload_search_bar__recs.addEventListener('mousedown', function(e){
    if(e.target.hasAttribute('data-search-bar__recommendations__item')) { 
        filter = get_tag_by_id(e.target.id)
        if(upload_chosen_tags.filter(function(e) { return e.id === filter.id }).length < 1) {    
            upload_chosen_tags.push(filter)
            const tag = document.importNode(tag_template.content, true)
            const tag_p = tag.querySelector('[data-tag__txt]')   
            tag_p.id = filter.id
            tag_p.innerText = filter.name
            tag.querySelector('[data-tag]').classList.add('tag--dark')
            
            upload_tag_container.appendChild(tag)
        }
        upload_search_bar__input.value = ''
    }
})

upload_search_bar__input.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
        filter = create_tag(e.target.value)
        if(upload_chosen_tags.filter(function(e) { return e.id === filter.id }).length < 1) {    
            upload_chosen_tags.push(filter)
            const tag = document.importNode(tag_template.content, true)
            const tag_p = tag.querySelector('[data-tag__txt]')   
            tag_p.id = filter.id
            tag_p.innerText = filter.name
            tag.querySelector('[data-tag]').classList.add('tag--dark')
            
            upload_tag_container.appendChild(tag)
        }
        e.target.value = ''
    }
})

upload_search_bar__input.addEventListener('focus', function(e){
    upload_search_bar__recs.style.display = 'block'
    render_search_results('', upload_search_bar__recs__conatiner, upload_search_bar__recs)
})
  
upload_search_bar__input.addEventListener('blur', function(e){
    upload_search_bar__recs.style.display = ''
})

upload_search_bar__input.addEventListener('input', function(e) {
    var filter, li, i, txtValue
    var found_smth = false
    filter = e.target.value.toUpperCase();
    render_search_results(filter, upload_search_bar__recs__conatiner, upload_search_bar__recs)
})


upload_tag_container.addEventListener('click', function(e) {
    if(e.target.hasAttribute('data-tag__close-btn')) {
        const tag_p = e.target.parentElement.querySelector('[data-tag__txt]')
        remove_filter_by_id(tag_p.id, upload_chosen_tags)
        e.target.parentElement.remove()
       //TODO: Tags filter changes and the photos that are being shown need to change
    }
})


upload_close_btn.addEventListener('click', function(e) {
    upload.classList.add('upload--hide')
    upload_chosen_tags = []
    clear_element(upload_tag_container)
    upload_name_input.value = ''
    //TODO: reset upload form data
})

upload_file_input.addEventListener('change', function(e) {
    uploaded_file = 'http://127.0.0.1:8887/' + e.target.value.split(/(\\|\/)/g).pop() 
})

upload.addEventListener('click', function(e) {  
    
    if(e.target.hasAttribute('data-upload__save-btn')) {
        if(upload_file_input.files.length == 1) {
            photos.push(create_photo(upload_name_input.value, uploaded_file, create_tag_id_array(upload_chosen_tags)))
            update_tags()
        }
        else {
            alert('Please upload a photo')
            return
        }

        if(is_empty_or_spaces(upload_name_input.value)) { 
            alert('Please give the photo a name')
            return
        } 
        upload.classList.add('upload--hide')
        upload_chosen_tags = []
        clear_element(upload_tag_container)
        upload_name_input.value = ''
        render_gallery_viewer(chosen_tags)
    } 
    
})

photos_grid.addEventListener('click', function(e) {
    if(e.target.hasAttribute('data-upload-a-photo')) {
        upload.classList.remove('upload--hide')
    }   
    else if(e.target.hasAttribute('data-photos-grid__img')) {
        let selected_photo = get_photo_by_id(e.target.id)
        photo_viewer__img.src = selected_photo.src
        if(is_img_vertical(e.target)) { photo_viewer.classList.add('photo-viewer--vertical') }
        photo_viewer.classList.remove('photo-viewer--hide')
    }   
})

tag_container.addEventListener('click', function(e) {
    if(e.target.hasAttribute('data-tag__close-btn')) {
        const tag_p = e.target.parentElement.querySelector('[data-tag__txt]')
        remove_filter_by_id(tag_p.id, chosen_tags)
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
        search_bar__input.value = ''
    }
})

search_bar__input.addEventListener('focus', function(e){
    search_bar__recs.style.display = 'block'
    render_search_results('', search_bar__recs__conatiner, search_bar__recs)
})
  
search_bar__input.addEventListener('blur', function(e){
    search_bar__recs.style.display = ''
})

search_bar__input.addEventListener('input', function(e) {
    var filter, li, i, txtValue
    var found_smth = false
    filter = e.target.value.toUpperCase()
    render_search_results(filter, search_bar__recs__conatiner, search_bar__recs)
    
})


//FUNCTIONS
function is_img_vertical(img_el) {
    if(img_el.height > img_el.width) { return true}
}

function update_tags() {
    for (let i = 0; i < upload_chosen_tags.length; i++) {
        new_tag = true
        for (let j = 0; j < tags.length; j++) {
            if(upload_chosen_tags[i].id === tags[j].id) { new_tag = false}
        }
        if(new_tag) { tags.push(upload_chosen_tags[i])}
    }
}

function create_tag_id_array(tag_list) {
    id_array = []
    for (let i = 0; i < tag_list.length; i++) {
        id_array.push(tag_list[i].id)
    }
    return id_array
}

function create_tag(name) {
    return { id: name.toUpperCase(), name: name}
}

function create_photo(photo_name, path, photo_tags) {
            //{id: '1', tags: ['ABSTRACT', 'ART'], name: 'Test', src: 'images/Test.jpeg'}
    return { id: Date.now().toString(), tags: photo_tags, name: photo_name, src: path }
}

//TODO: better system for search results is needed
function render_search_results(filter, search_bar_rec_container_el, search_bar__recs_el) {
    clear_element(search_bar_rec_container_el)
    found_smth = false
    if(!is_empty_or_spaces(filter)) {
        
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].name.toUpperCase().indexOf(filter) > -1) {
                
                const result = document.importNode(results_template.content, true)
                const result_p = result.querySelector('[data-search-bar__recommendations__item]')   
                result_p.id = tags[i].id
                result_p.innerText = tags[i].name
                search_bar_rec_container_el.appendChild(result)

                found_smth = true
            }
        }

        if(!found_smth) { search_bar__recs_el.style.display = '' } 
        else { search_bar__recs_el.style.display = 'block' }
    }
    else {
        for (let i = 0; i < tags.length; i++) {
            const result = document.importNode(results_template.content, true)
            const result_p = result.querySelector('[data-search-bar__recommendations__item]')   
            result_p.id = tags[i].id
            result_p.innerText = tags[i].name
            search_bar_rec_container_el.appendChild(result)
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
            const item_name = item.querySelector('[data-photos-grid__item-name]')   
            item_img.id = photos[i].id
            item_img.src = photos[i].src
            item_name.innerHTML = photos[i].name
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
    for (let i = 0; i < tags.length; i++) {
        if (tags[i].id == id) { return tags[i] }
    }
}

function get_photo_by_id(id) {
    for (let i = 0; i < photos.length; i++) {
        if (photos[i].id == id) { return photos[i] }
    }
}

function remove_filter_by_id(id, tags_list) {
    for (let i = 0; i < tags_list.length; i++) {
        if (tags_list[i].id == id) { 
            tags_list.splice(i, 1);
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
