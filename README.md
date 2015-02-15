# A Node.js library for SmugMug

This library is very much in it infancy and only support a small number of methods that the SmugMug 1.3.0 API supports.  These methods should work, but they have not been tested on a large scale.  SmugMug states that 1.3.0 is deprecated and will be removed "in the future."  It is unlikely that this API will be removed tomorrow since the 2.0 API is still in beta.

# Example Usage

The example below will login and list all of the albums for the user _exampleuser_

```javascript
var humble = require('humblemug');
humble.config({api_key: '1234567890abc'});
humble.login.anon().then(function () {
    humble.albums.get('exampleuser').then(function (album_list) {
        console.log(album_list);
    });
});
```

# Documentation
##config
Config takes in an object of configuration information to store and use.
```javascript
humble.config({api_key: '1234567890abc'});
```
##login
###Anonymously
```javascript
humble.login.anon().then(function () {
    //Do Stuff
});
```
##albums
###get
Lists all of the albums for a given user
```javascript
humble.albums.get('username').then(function (album_list) {
    //Do Stuff
});
```
###getInfo
Gets all the info for a given album
```javascript
humble.albums.getInfo('album_id', 'album_key').then(function (album_info) {
    //Do Stuff
});
```
##images
###get
Lists all of the images in an album
```javascript
humble.images.get('album_id', 'album_key').then(function (image_list) {
    //Do Stuff
});
```