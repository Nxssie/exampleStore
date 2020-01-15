window.onload = initialize;

function initialize() {
  initializeFirebase();

  captureSubmitEventWhenAddingAnItem();
  captureEditAction();
  downloadItems();
}


function captureEditAction() {
  var editItem = document.getElementsByClassName("editor");
  for (i = 0; i < editItem.length; i++) {
  editItem[i].addEventListener("click", editItem);
  }
}

function editItem(event) {
  var itemToEdit = event.target;
  var editForm = ""
  editForm +=
  '<form id="form-item">' +
    '<div class="form-group">' +
      '<label for="type">Item Type</label>' +
      '<input type="text" class="form-control" id="type" name="type" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label for="stock">Stock</label>' +
      '<input type="number" class="form-control" id="stock" name="stock" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label for="price">Price</label>' +
      '<input type="number" class="form-control" id="price" name="price" />' +
    '</div>' +
    '<button id="create-element" type="submit" class="btn btn-primary"> Create an Item </button>' +
  '</form>'

  itemToEdit.innerHTML = editForm;
}


function captureSubmitEventWhenAddingAnItem() {
  document.getElementById("form-item").addEventListener("submit", addItem);
}

function addItem(event) {
  event.preventDefault();
  var formItem = event.target;

  var refItemToAdd = firebase.database().ref("store/items");

  refItemToAdd.push({
    type: formItem.type.value,
    stock: formItem.stock.value,
    price: formItem.price.value
  });

  formItem.reset();
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
  for (var i = 0; i < removers.length; i++) {
    removers[i].addEventListener("click", deleteItem);
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
