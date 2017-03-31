/*===============
 *  Author: John Desjardins desj0251@algonquinlive.com
 *  Date: Mar 31 2017
 *  File: app.js v1.0.0
 *  Description: Main javascript for GiftR, runs both pages
 *  Installed on Samsung Galaxy S5 -2
 ================*/
"use strict";

if (document.deviceready) {
    document.addEventlistener('deviceready', onDeviceReady);
} else {
    document.addEventListener('DOMContentLoaded', onDeviceReady)
}

var currentPerson = 0;
var storedPeople = [];
var currentIdea = 0;

window.addEventListener('push', function (ev){
   
    var contentDiv = ev.currentTarget.document.querySelector(".content")
    var id = contentDiv.id;
    switch (id) {
        case "index": 
            document.getElementById("saveContact").addEventListener("touchend", function(){ addContact(); });
            document.getElementById("cancelContact").addEventListener("touchend", function(){ toggleDisplay(); });
            document.getElementById("add").addEventListener("touchstart", function(){ hitAddContact(); });
            displayPeople();
            break;
        case "gifts":  
            displayIdeas();
            document.getElementById("giftsave").addEventListener("touchend", function(){ addIdea(); });
            document.getElementById("giftcancel").addEventListener("touchend", function(){ toggleDisplayGift(); });
            document.getElementById("addidea").addEventListener("touchstart", function(){ hitAddIdea(); });
            break;
        default:
            displayPeople();
    }
    
});

function onDeviceReady() {

    if (!localStorage.getItem("giftr-desj0251")) {
        console.log("No saved data");
        localStorage.setItem("giftr-desj0251", JSON.stringify(storedPeople));
    } else {
        console.log("Retrieving Local Storage Data: ");
        storedPeople = JSON.parse(localStorage.getItem("giftr-desj0251"));
        console.log(storedPeople);
    }
    
    document.getElementById("saveContact").addEventListener("click", function(){ addContact(); });
    document.getElementById("cancelContact").addEventListener("click", function(){ toggleDisplay(); });
    document.getElementById("add").addEventListener("touchstart", function(){ hitAddContact(); });
    
    displayPeople();
    
}

function hitAddContact() {
    currentPerson = 0;
    console.log("Reset Current Person");
    document.getElementById("name").value = "";
    document.getElementById("dob").value = "";
}

function displayPeople(){

    var ul = document.getElementById("contact-list");
    ul.innerHTML = "";
    
    function compare(a, b) {
        if (a.dob.substring(5) < b.dob.substring(5)) return -1;
        if (a.dob.substring(5) > b.dob.substring(5)) return 1;
        return 0;
    }
    storedPeople.sort(compare);
    
    storedPeople.forEach(function (value) {
        
        var listItem = document.createElement("li");
            listItem.classList.add("table-view-cell");
        var span = document.createElement("span");
            span.classList.add("name");
        var a1 = document.createElement("a");
            a1.href = "#personModal";
            a1.classList.add("name");
            a1.setAttribute("id", name);
            a1.setAttribute("person-id", value.id);
            a1.innerHTML = value.name;
        var a2 = document.createElement("a");
            a2.classList.add("navigate-right");
            a2.classList.add("pull-right");
            a2.href = "gifts.html";
        var spanDob = document.createElement("span");
            spanDob.classList.add("dob");
            spanDob.innerHTML = moment(value.dob).format("MMMM DD");
        // let ul = document.getElementById("contact-list");
            a2.appendChild(spanDob);
            span.appendChild(a1);
            listItem.appendChild(span);
            listItem.appendChild(a2);
            ul.appendChild(listItem);
        listItem.addEventListener("touchstart", function(ev){
                currentPerson = a1.getAttribute("person-id");
                console.log(currentPerson);
                editContact(currentPerson);
        })
    })
                         
}

function editContact(current){
    storedPeople.forEach(function (value) {
        if(value.id == current){
            document.getElementById("name").value = value.name,
            document.getElementById("dob").value = value.dob;
        }
    })
}

function addContact(){
    
    if (currentPerson == 0){
        
        var newContact = {
            id: Date.now(),
            name: document.getElementById("name").value,
            dob: document.getElementById("dob").value,
            ideas: [],
        };
        
        // Push and save newContact
        storedPeople.push(newContact);
        localStorage.setItem("giftr-desj0251", JSON.stringify(storedPeople));
        
    } else {
        
        storedPeople.forEach(function(value){
            if(value.id == currentPerson){
                value.name = document.getElementById("name").value;
                value.dob = document.getElementById("dob").value;
            }
        });
        
        localStorage.setItem("giftr-desj0251", JSON.stringify(storedPeople));
    }
  
    toggleDisplay(); // Closes Modal Form
    displayPeople(); // Displays New List with added contact
    
}

function toggleDisplay(){
    var contactform = document.querySelector("#personModal");
    contactform.classList.toggle("active");
}

function toggleDisplayGift(){
    var contactform = document.querySelector("#giftModal");
    contactform.classList.toggle("active");
}

function displayIdeas() { 
    
    var ul = document.getElementById("gift-list");
    ul.innerHTML = "";
    
    storedPeople.forEach(function (value1, index1) {
        if(value1.id == currentPerson){
            document.querySelector(".title").innerHTML = value1.name;
            document.querySelector("#person-name").innerHTML = "Gift idea for " + value1.name;
            value1.ideas.forEach(function (value2, index2){
              
                var listItem = document.createElement("li");
                    listItem.classList.add("table-view-cell");
                    listItem.classList.add("media");
                    ul.appendChild(listItem);
                var span = document.createElement("span");
                    span.classList.add("pull-right");
                    span.classList.add("icon");
                    span.classList.add("icon-trash");
                    span.classList.add("midline");
                    span.classList.add("trashicon");
                    listItem.appendChild(span);
                var div = document.createElement("div");
                    div.classList.add("media-body");
                var a = document.createElement("a");
                    a.href = "#giftModal";
                    a.classList.add("ideaname");
                    a.innerHTML = value2.idea;
                    div.appendChild(a);
                    div.setAttribute("gift-id", value2.id);
                    listItem.appendChild(div);
                listItem.addEventListener("touchstart", function(ev){
                    currentIdea = div.getAttribute("gift-id");
                    console.log(currentIdea);
                    editIdea(currentIdea);
                })
                if (value2.at != ""){
                    var p1 = document.createElement("p");
                        p1.innerHTML = value2.at;
                        listItem.appendChild(p1);
                }
                if (value2.url != ""){
                    var p3 = document.createElement("p");
                    var a2 = document.createElement("a");    
                    a2.innerHTML = value2.url;
                    a2.href = value2.url;
                    a2.setAttribute("target", "_blank");
                        listItem.appendChild(p3);
                        p3.appendChild(a2);
                }
                if (value2.cost != ""){
                    var p2 = document.createElement("p");
                        p2.innerHTML = value2.cost;
                        listItem.appendChild(p2);
                }
                
            })
        }
    })
    
    var deleteButtons = document.querySelectorAll(".icon-trash");
    [].forEach.call(deleteButtons, function (value){
        value.addEventListener("click", deleteIdea);
    })
}

function addIdea() {
    
    if (currentIdea == 0){
        var newIdea = {
            id: Date.now(),
            idea: document.getElementById("ideaname").value, 
            at: document.getElementById("idealocation").value, 
            cost: document.getElementById("ideacost").value, 
            url: document.getElementById("ideaurl").value
        };
        storedPeople.forEach(function(value){
            if(value.id == currentPerson){
                value.ideas.push(newIdea);
            }
        })
        
        localStorage.setItem("giftr-desj0251", JSON.stringify(storedPeople));
    } else {
        storedPeople.forEach(function (value1){
            value1.ideas.forEach(function (value2, index){
                if (value2.id == currentIdea){
                    value2.idea = document.getElementById("ideaname").value, 
                    value2.at = document.getElementById("idealocation").value, 
                    value2.cost = document.getElementById("ideacost").value, 
                    value2.url = document.getElementById("ideaurl").value
                } 
            })
        })
        localStorage.setItem("giftr-desj0251", JSON.stringify(storedPeople));
    }
    
    toggleDisplayGift();
    displayIdeas();
}

function editIdea(current) {
    storedPeople.forEach(function (value1){
        value1.ideas.forEach(function (value2, index){
            if(value2.id == current){
                document.getElementById("ideaname").value = value2.idea;
                document.getElementById("idealocation").value = value2.at;
                document.getElementById("ideacost").value = value2.cost;
                document.getElementById("ideaurl").value = value2.url;
            }
        })
    })
}

function deleteIdea() {
     
    storedPeople.forEach(function (value1){
        value1.ideas.forEach(function (value2, index){
            if(currentIdea == value2.id){
                value1.ideas.splice(index, 1);
                localStorage.setItem("giftr-desj0251", JSON.stringify(storedPeople));
                displayIdeas();
            }  
        })
    })
    
}

function hitAddIdea() {
    
    currentIdea = 0;
    console.log("Reset Current Idea");
    document.getElementById("ideaname").value = "";
    document.getElementById("idealocation").value = "";
    document.getElementById("ideacost").value = "";
    document.getElementById("ideaurl").value = "";

}