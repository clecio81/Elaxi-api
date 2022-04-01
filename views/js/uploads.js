// define URL and for element
const url = "localhost:5001/elaxi-api/us-central1/app/api/database/upload-avatar";
const form = document.querySelector('form');

// add event listener
form.addEventListener('submit', e => {

    // disable default action
    e.preventDefault();

    // collect files
    const files = document.querySelector('[name=file]').files;
    const formData = new FormData();
    formData.append('avatar', files[0]);

    // post form data
    const xhr = new XMLHttpRequest();

    // log response
    xhr.onload = () => {
        console.log(xhr.responseText);
    };

    // create and send the reqeust
    xhr.open('POST', url);
    xhr.send(formData);
});