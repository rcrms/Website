
function supportsImports() {
    return 'import' in document.createElement('link');
}

if (!supportsImports()) {
    // Good to go!
    console.log('it is supported');

    var link = document.querySelector('link[rel="import"]');
    var content = link.import;

    var app = content.querySelector('#app');
    var auth = content.querySelector('#auth');
    var firebase = content.querySelector('#firebase');
    var database = content.querySelector('#database');

    var div = document.getElementById('scriptTarget');

    div.appendChild(app.cloneNode(true));
    div.appendChild(auth.cloneNode(true));
    div.appendChild(firebase.cloneNode(true));
    div.appendChild(database.cloneNode(true));
} else {
    // Use other libraries/require systems to load files.
    console.log('it is NOT supported');
}

