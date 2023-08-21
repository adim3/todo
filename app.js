
const alert = document.querySelector(".alert");
const taskForm = document.querySelector(".task-form");
const input = document.getElementById("tasks");

const submitBtn = document.querySelector(".submit-btn");
const clearBtn= document.querySelector(".clear-btn");

const taskContainer = document.querySelector(".task-container");
const taskList = document.querySelector(".task-list");


 
//edit option............
let editElement;
let editFlag = false;
let editId = "";

// ********** EVENT LISTENER**********************

//submit form................................................

 taskForm.addEventListener("submit", addItem);

 // clears all items..........................................
 clearBtn.addEventListener("click",clearItems);
 //load all items 
 window.addEventListener('DOMContentLoaded',setUpItems);
//********* FUNCTIONS****************** *************/

// function for adding new element or items.=======================
function addItem(e){ // e is event object...

   e.preventDefault();
  const value = input.value;
  const id = new Date().getTime().toString();


  // condition for input value is present and creating new item.......
  
  if(value && editFlag === false ){
  // creating a new article element.........
     createListItems(id,value);
 // display success adding aleart.......
 displayAlert("Add Item Sucessful","success");
// show container.........
taskContainer.classList.add("show-container");

// add to local storage..........
addToLocalStorage(id,value);

// set back to defuault input value....
  setBackToDefault();

  }
  //for editing existing items==========================
  else if(value!=='' && editFlag === true){
    // console.log("editing task")
    editElement.innerHTML=value;
    displayAlert("Value Got Changed","success");
    editLocalStorage(editId,value);
     setBackToDefault();
  }
  //when user click submit without add input text value , in this case just show a alert "empty value"..............
  else{
  displayAlert("please enter a value","danger");
  }

}

// display aleart.................................
 
function displayAlert(text,action){
alert.textContent = text;
alert.classList.add(`alert-${action}`);
//remove alert masseg after a time.....
setTimeout(function(){
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
}, 2000);

}

/*** Set back to defult value========== */
function setBackToDefault(){
  input.value="";
  editFlag = false;
  editId='';
  submitBtn.textContent = "submit";
   }
 

// function for clearing all items .......................................
 function clearItems(){

  const items = document.querySelectorAll(".task-item");
  if(items.length>0){
    items.forEach(function(it){
      taskList.removeChild(it);
     })
  }
  taskContainer.classList.remove("show-container");
  displayAlert("ALl task clear sucessfully!",'danger');
  setBackToDefault();
//  localStorage.removeItem('taskList')
 }


// function for delete item.....................................
 
 function deleteItem(e){

  const el = e.currentTarget.parentElement.parentElement;
  const id = el.dataset.id;
  taskList.removeChild(el);
  //for when all items are removed then also remove clear all items text form task container
  if(taskList.length==0){
    taskContainer.classList.remove("show-container");
  }
   
  displayAlert("Item removed",'danger');
  setBackToDefault();
  // remove deleted item form local storage...
   removeFromLocalStorage(id);

 }
 
//  function for complete task......................................
 
function complete(e) {
  // console.log("hi")
  const el = e.currentTarget.parentElement;
  el.classList.toggle("complete-task")
  displayAlert("Hurry!! You complete one more task.","success")
}
function incomplete(e){
  const el = e.currentTarget.parentElement;
  el.classList.remove("complete-task")
}
// function for editing individual item................................

 function editItem(e){

  const el = e.currentTarget.parentElement.parentElement;
  //set edit item..
  editElement= e.currentTarget.parentElement.previousElementSibling;
  //set form value..
 input.value = editElement.innerHTML;
 editFlag = true;
 editId = el.dataset.id;
  //for set submit button text = edit when we click in edit item
  submitBtn.textContent = "Edit";

 }



 
// ***********LOCAL STORAGE***************

function addToLocalStorage(id,value){
  const task = {id,value};
  // console.log(itm);
 let items = getLocalStorage();
  // console.log(items)
 items.push(task);
 localStorage.setItem('taskList',JSON.stringify(items));

}

function editLocalStorage(id,value){
  let items = getLocalStorage();
 items = items.map(function(item){
  if(item.id === id){
    item.value = value;
  }
  return item;
 })
 localStorage.setItem('taskList',JSON.stringify(items));
}

function removeFromLocalStorage(id){

  let items = getLocalStorage();
   items = items.filter(function(item){
    // console.log(item);
    if(item.id != id){
      return item;
    }
   })
   localStorage.setItem("list",JSON.stringify(items));

}

function getLocalStorage(){
 return  localStorage.getItem("taskList")
 ? JSON.parse(localStorage.getItem("taskList"))
 : [];
}
//localStorage API

//setItem...
// localStorage.setItem('orange',JSON.stringify(['item','item2']));
//getItem...
// const oranges = JSON.parse(localStorage.getItem('orange'));
// console.log(oranges);
//removeItem...

//*********** SETUP ITEMS ********************* */

function setUpItems(){
  let items = getLocalStorage();
  if(items.length>0){
    items.forEach(function(item){
      createListItems(item.id,item.value);
    })
 taskContainer.classList.add("show-container");
  }
}



function createListItems(id,value){

  const Element = document.createElement('article');
  // add class to elemtn.........
  Element.classList.add('task-item');
  // add id to element.............
  const attrib = document.createAttribute('data-id');
  attrib.value = id;
    Element.setAttributeNode(attrib);
 // add HTML...............
    Element.innerHTML=`<p class="title "> <input type="checkbox" class="checkbox"> ${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn"><i class="uil uil-edit"></i> </button>
        <button type="button" class="delete-btn"> <i class="uil uil-trash-alt"></i></button>
    </div>`;
    
    
    const deleteBtn = Element.querySelector(".delete-btn")
    const editBtn = Element.querySelector(".edit-btn");
    const checkBox = Element.querySelector(" .checkbox");
    // console.log(checkBox)
  deleteBtn.addEventListener("click",deleteItem);
  editBtn.addEventListener("click",editItem);

  checkBox.addEventListener("click", complete)
  // checkBox.addEventListener("change", (e) =>{
  //   if(this.checked){
  //    complete(e);
  //   }else{
  //     incomplete(e);
  //   }
  // })

 // append chiild to task-list......
 taskList.appendChild(Element);

}


