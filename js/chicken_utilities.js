"use strict"

function createElement(tag, attributes, text){
    //if(attributes == null) attributes = "";
    return "<"+tag+attributes+">"+text+"/<"+tag+">";
}

function parseQuery(url){
    var object = {};
    var queryFields = url.split("?")[1].split("&");
    
    for(var i=0;i<queryFields.length; i++){
        var splitField = queryFields[i].split("=");
        object[splitField[0]] = splitField[1];
    }
    return object;
}