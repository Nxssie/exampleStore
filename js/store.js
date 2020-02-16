window.onload = initialize;

const ADD = "add";
const UPDATE = "update";
let operation = ADD;
let keyItem;
let validated = 0;

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

  if (formItem.noexistences.checked) {
    formItem.stock.value = 0;
  }

  const formToValidate = formItem;
  const formItemType = formToValidate["type"].value;
  const formItemStock = formToValidate["stock"].value;
  const formItemPrice = formToValidate["price"].value;

  //Errors validations
  if (
    !formItemType ||
    typeof formItemType != "string" ||
    formItemType instanceof String
  ) {
    console.log("Error de tipo de producto.");
    document.getElementById("type-error").style.display = "block";
    event.preventDefault();
  } else if (!formItemStock || formItemStock < 0) {
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

  let file = formItem.image.files[0];
  let fileName = file.name;
  
  if (validated == 1) {
    if (operation == ADD) {
      let refItem = firebase.database().ref("store/items");

      if (formItem.noexistences.checked) {
        formItem.stock.value = 0;
      }


      let ref = firebase.storage().ref().child(fileName);
      ref.put(file).then(function (snapshot) {
        console.log('Uploaded a blob or file!');
        console.log(formItem);
        formItem.stock.value = 10;

        ref.getDownloadURL().then(function (url) {

          let refDatabase = firebase.database().ref("store/items");
          refDatabase.push({
            type: formItem.type.value,
            stock: formItem.stock.value,
            price: formItem.price.value,
            image_url: url
          });
        }).catch(function (error) {
          console.log(error);
        });
      });
      formItem.reset();
    } else {
      refItemToEdit = firebase.database().ref("store/items/" + keyItem);

      if (formItem.noexistences.checked) {
        formItem.stock.value = 0;
      }

      
      let ref = firebase.storage().ref().child(fileName);
      ref.put(file).then(function (snapshot) {
        console.log('Uploaded a blob or file!');

        ref.getDownloadURL().then(function (url) {

          let refDatabase = firebase.database().ref().child("store/items");
          refItemToEdit.update({
            type: formItem.type.value,
            stock: formItem.stock.value,
            price: formItem.price.value,
            image_url: url
          });
        }).catch(function (error) {
          // Handle any errors
        });
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
  let firebaseConfig = {
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
  let items = firebase.database().ref("store/items");
  items.on("value", showItems);
  //console.log("downloadItems function end itself execution.");
}

function showItems(snap) {
  let data = snap.val();

  let rows = "";

  for (let key in data) {
    rows +=
      "<tr>" +
      "<td>" +
      '<img data-bicycle-id="' + key + '" class="img-fluid imgOnDB" src="' + 
                           data[key].image_url + '" alt="image"/>' +
      "</td>" +
      "<td>" + data[key].type + "</td>" +
      "<td>" + data[key].stock + "</td>" +
      "<td>" + data[key].price + "</td>" +
      '<td>' +
      '<i class="fas fa-trash-alt remover" data-item="' + key +
      '"></i> <i class="fas fa-edit editor" data-item="' + key +
      '"></i> </td>' +
      "</tr>";
  }

  let myItemBody = document.getElementById("my-item-list");
  myItemBody.innerHTML = rows;
  //console.log("showItems function ends itself execution.");

  /* User actions */
  let removers = document.getElementsByClassName("remover");
  let editors = document.getElementsByClassName("editor");
  for (let i = 0; i < removers.length; i++) {
    removers[i].addEventListener("click", deleteItem);
    editors[i].addEventListener("click", editItem);
  }
}

// See you again https://www.youtube.com/watch?v=RgKAFK5djSk
function deleteItem(event) {
  let buttonClicked = event.target;

  let keyItemToDelete = buttonClicked.getAttribute("data-item");
  let refItemToDelete = firebase
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

  let buttonClicked = event.target;

  let formItem = document.getElementById("form-item");

  keyItem = buttonClicked.getAttribute("data-item");
  let refItemToEdit = firebase.database().ref("store/items/" + keyItem);
  refItemToEdit.once("value", function (snap) {
    let data = snap.val();

    if (formItem.noexistences.checked) {
      data.stock = 0;
    }

    formItem.type.value = data.type;
    formItem.stock.value = data.stock;
    formItem.price.value = data.price;
  });
}
