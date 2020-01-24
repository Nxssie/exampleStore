window.onload = initialize;

const ADD = "add";
const UPDATE = "update";
var operation = ADD;
var keyItem;
var validated = 0;

const cancelButton = document.getElementById("cancel-button");
const editButton = document.getElementById("edit-element");
const createButton = document.getElementById("create-element");
const formItem = document.getElementById("form-item");

function initialize() {
  initializeFirebase();

  captureSubmitEventWhenAddingAnItem();
  captureFormCancel();
  downloadItems();
}

// Sick of validations, i really hate them :c
function validateForm(event) {

  
  event.preventDefault();

  const formToValidate = formItem;
  const formItemType = formToValidate["type"].value;
  const formItemStock = formToValidate["stock"].value;
  const formItemPrice = formToValidate["price"].value;

  if (formItem.noexistences.checked) {
    formItem.stock.value = 0;
  }

  //Errors validations
  if (!formItemType || typeof formItemType != 'string' || formItemType instanceof String) {
    console.log("Error de tipo de producto.");
    document.getElementById("type-error").style.display = "block";
    event.preventDefault();
  } else if (!formItemStock || formItemStock <0) {
    console.log(formItemStock);
    console.log("Error de stock.");
    document.getElementById("stock-error").style.display = "block";
    event.preventDefault();
  } else if (!formItemPrice || formItemPrice <= 0) {
    console.log("Error de precio");
    document.getElementById("price-error").style.display = "block";
    event.preventDefault();
  } else {
    document.getElementById("type-error").style.display = "none";
    document.getElementById("stock-error").style.display = "none";
    document.getElementById("price-error").style.display = "none";
    validated = 1;
    addOrUpdateItem();
  }
  
  //Clear errors in each case
  if (formItemType) {
    document.getElementById("type-error").style.display = "none";
  }
  if (formItemStock) {
    document.getElementById("stock-error").style.display = "none";
  }
  if (formItemPrice) {
    document.getElementById("price-error").style.display = "none";
  }

}

// Words enough :rotfl
function captureSubmitEventWhenAddingAnItem() {
  formItem.addEventListener("submit", validateForm);
}

// Just capturing the cancel of an editing action
function captureFormCancel() {
  formItem.addEventListener("reset", cancelEditing);
}

// Adding some things to my inventory 
function addOrUpdateItem() {
  if (validated == 1) {
    if (operation == ADD) {
      var refItem = firebase.database().ref("store/items");
      
      if (formItem.noexistences.checked) {
        formItem.stock.value = 0;
      }

      refItem.push({
        type: formItem.type.value,
        stock: formItem.stock.value,
        price: formItem.price.value
      });
  
      formItem.reset();
    } else {
      refItemToEdit = firebase.database().ref("store/items/" + keyItem);
  
      if (formItem.noexistences.checked) {
        formItem.stock.value = 0;
      }

      refItemToEdit.update({
        type: formItem.type.value,
        stock: formItem.stock.value,
        price: formItem.price.value
      });
      
      editButton.style.display = "none";
      cancelButton.style.display = "none";
      createButton.style.display = "inline-block";
  
      formItem.reset();
    }
  } else {
    console.log("Error general.");
  }
}

// THE HOLY CANCEL FUNCTION
function cancelEditing() {
  operation = ADD;
  editButton.style.display = "none";
  cancelButton.style.display = "none";
  createButton.style.display = "inline-block";

  //In case of existing errors, cancel button clears them
  document.getElementById("type-error").style.display = "none";
  document.getElementById("stock-error").style.display = "none";
  document.getElementById("price-error").style.display = "none";
}

// This is the most boring part of the code, just close your eyes, please
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

// YEY visualizing!!
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

// See you again https://www.youtube.com/watch?v=RgKAFK5djSk
function deleteItem(event) {
  var buttonClicked = event.target;

  var keyItemToDelete = buttonClicked.getAttribute("data-item");
  var refItemToDelete = firebase
    .database()
    .ref("store/items/" + keyItemToDelete);
  refItemToDelete.remove();
}

// Im not happy with those items so I'm gonna change them
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

    if (formItem.noexistences.checked) {
      data.stock = 0;
    }

    formItem.type.value = data.type;
    formItem.stock.value = data.stock;
    formItem.price.value = data.price;
  });

}
