window.onload = initialize;

const ADD = "add";
const UPDATE = "update";
var operation = ADD;
var keyItem;

function initialize() {
  initializeFirebase();

  captureSubmitEventWhenAddingAnItem();
  downloadItems();
}

function captureSubmitEventWhenAddingAnItem() {
  document
    .getElementById("form-item")
    .addEventListener("submit", addOrUpdateItem);
}

function addOrUpdateItem(event) {
  event.preventDefault();

  var formItem = event.target;

  if (operation == ADD) {
    var refItem = firebase.database().ref("store/items");

    refItem.push({
      type: formItem.type.value,
      stock: formItem.stock.value,
      price: formItem.price.value
    });

    formItem.reset();
  } else {
    refItemToEdit = firebase.database().ref("store/items/" + keyItem);

    refItemToEdit.update({
      type: formItem.type.value,
      stock: formItem.stock.value,
      price: formItem.price.value
    });
    
    document.getElementById("cancel-button").addEventListener("reset", updateCancelButton);
    document.getElementById("edit-element").style.display = "none";
    document.getElementById("cancel-button").style.display = "none";
    document.getElementById("create-element").style.display = "inline-block";

    formItem.reset();
  }
}

function updateCancelButton() {
  document.getElementById("edit-element").style.display = "none";
  document.getElementById("cancel-button").style.display = "none";
  document.getElementById("create-element").style.display = "inline-block";
}

function initializeFirebase() {
  var firebaseConfig = {
    apiKey: "AIzaSyAmDr6GpyPE4utgKJTLAZzjUbIwXJ767Ls",
    authDomain: "examplestore-1b638.firebaseapp.com",
    databaseURL: "https://examplestore-1b638.firebaseio.com",
    projectId: "examplestore-1b638",
    storageBucket: "examplestore-1b638.appspot.com",
    messagingSenderId: "821111168891",
    appId: "1:821111168891:web:8a0aa658ed6acd5871e7de"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log("firebase initializated");
}

function downloadItems() {
  var items = firebase.database().ref("store/items");
  items.on("value", showItems);
  //console.log("downloadItems function end itself execution.");
}

function showItems(snap) {
  var data = snap.val();

  var rows = "";

  for (var key in data) {
    rows +=
      "<tr>" +
      "<td>" +
      data[key].type +
      "</td>" +
      "<td>" +
      data[key].stock +
      "</td>" +
      "<td>" +
      data[key].price +
      "</td>" +
      '<td> <i class="fas fa-trash-alt remover" data-item="' +
      key +
      '"></i> <i class="fas fa-edit editor" data-item="' +
      key +
      '"></i> </td>' +
      "</tr>";
  }

  var myItemBody = document.getElementById("my-item-list");
  myItemBody.innerHTML = rows;
  //console.log("showItems function ends itself execution.");

  /* User actions */
  var removers = document.getElementsByClassName("remover");
  var editors = document.getElementsByClassName("editor");
  for (var i = 0; i < removers.length; i++) {
    removers[i].addEventListener("click", deleteItem);
    editors[i].addEventListener("click", editItem);
  }
}

function deleteItem(event) {
  var buttonClicked = event.target;

  var keyItemToDelete = buttonClicked.getAttribute("data-item");
  var refItemToDelete = firebase
    .database()
    .ref("store/items/" + keyItemToDelete);
  refItemToDelete.remove();
}

function editItem(event) {
  document.getElementById("edit-element").style.display = "inline-block";
  document.getElementById("cancel-button").style.display = "inline-block";
  document.getElementById("create-element").style.display = "none";
  operation = UPDATE;

  var buttonClicked = event.target;

  var formItem = document.getElementById("form-item");

  keyItem = buttonClicked.getAttribute("data-item");
  var refItemToEdit = firebase.database().ref("store/items/" + keyItem);
  refItemToEdit.once("value", function(snap) {
    var data = snap.val();
    formItem.type.value = data.type;
    formItem.stock.value = data.stock;
    formItem.price.value = data.price;
  });

}
