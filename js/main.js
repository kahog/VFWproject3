//Jeremy orr
// VFW 1209
//Project 4
//09/14/2012




//check to make sure the DOM is ready

window.addEventListener("DOMContentLoaded", function(){
	// Get element by Id function
	function $(x){
		var theElement = document.getElementById(x);
		return theElement;	
	}
	// create select field and populate with options
	function makeCats(){
		var formTag = document.getElementsByTagName("form"),
			selectLi = $("select"),
			makeSelect = document.createElement("select");
			makeSelect.setAttribute("id", "types");
		for (var i=0, j=constructionTypes.length; i<j; i++){
			var makeOption = document.createElement("option");
			var	optText = constructionTypes[i];
				makeOption.setAttribute("value", optText);
				makeOption.innerHTML = optText;
				makeSelect.appendChild(makeOption);
		}	
		selectLi.appendChild(makeSelect);
	}
	
	function getSelectedCheckbox(){
		var checkBox = document.forms[0].projectLocation;
		for (var i=0; i<checkBox.length; i++){
			if (checkBox[i].checked){
				locationValue = checkBox[i].value;
			}
		}
	}
	
	function toggleControls(n){
		switch(n){
			case "on":
				$("projectForm").style.display = "none";
				$("clearData").style.display = "inline";
				$("displayData").style.display = "none";
				$("addItem").style.display = "inline";
				break;
			case "off":
				$("projectForm").style.display = "block";
				$("clearData").style.display = "inline";
				$("displayData").style.display = "inline";
				$("addItem").style.display = "none";
				$("Project List").style.display = "none";
			
				break;
				default:
			return false;
		}
	}
	
	function storeData(key){
		if(!key){
		var id = Math.floor(Math.random() * 100000101);
		} else{
		  id = key;
		}
		getSelectedCheckbox();
		var item = {};
		item.types = ["Construction Type:", $("types").value];
		item.projectName = ["Project Name:", $("projectName").value];
		item.projectBudget = ["Project Budget:", $("projectBudget").value];
		item.projectLocation = ["Project Location:", locationValue];
		item.startDate = ["Start Date:", $("date").value];
		item.supplyList = ["Supply List:", $("supplyList").value];
		localStorage.setItem(id, JSON.stringify(item));
		alert("Project Has Been Added");
		
	}
	
	function getData(){
		toggleControls("on");
		if (localStorage.length === 0){
			alert("There is no data in local storage so default data was added.");
			autoFillData();
		}
		var makeDiv = document.createElement("div");
		makeDiv.setAttribute("id", "Project List");
		var makeList = document.createElement("ul");
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		
		for (var i=0, len=localStorage.length; i<len; i++){
			var makeLi = document.createElement("li");
			var linksLi = document.createElement("li");
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			var obj = JSON.parse(value);
			makeSubList = document.createElement("ul");
			makeLi.appendChild(makeSubList);
			getImage(obj.types[1], makeSubList);
			for (var n in obj){
				var makeSubLi = document.createElement("li");
				makeSubList.appendChild(makeSubLi);
				var objSubText = obj[n][0]+" "+obj[n][1];
				makeSubLi.innerHTML = objSubText;
				makeSubList.appendChild(linksLi);
			}
			makeItemLinks(localStorage.key(i), linksLi);
		}
	}
	
	function getImage(typeName, makeSubList){
		var imageLi = document.createElement("li");
		makeSubList.appendChild(imageLi);
		var newImg = document.createElement("img");
		var setSrc = newImg.setAttribute("src", "images/"+typeName + ".png")
		imageLi.appendChild(newImg);
	}
	
	function autoFillData(){
		for (var n in json){
			var id = Math.floor(Math.random() * 100000101);
			localStorage.setItem(id, JSON.stringify(json[n]));
		}
	}

	//make links in stored data
	function makeItemLinks(key, linksLi){
		var editLink = document.createElement("a");
		editLink.href = "#";
		editLink.key = key;
		var editText = "Edit Project";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);
		
		var breakTag = document.createElement("br");
		linksLi.appendChild(breakTag);
		
		var deleteLink = document.createElement("a");
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete Project";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);
	};
	
	function editItem (){
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);
		//show the form
		toggleControls("off");
		//populate the form with the saved data
		$("types").value = item.types[1];
		$("projectName").value = item.projectName[1];
		$("projectBudget").value = item.projectBudget[1];
		var checkBoxes = document.forms[0].projectLocation;
		for(var i = 0; i < checkBoxes.length; i++){
			if (checkBoxes[i].value == "Interior" && item.projectLocation[1] == "Interior"){
				checkBoxes[i].setAttribute("checked", "checked");
			} else if (checkBoxes[i].value == "Exterior" && item.projectLocation[1] == "Exterior"){
				checkBoxes[i].setAttribute("checked", "checked");
			}
		}
		$("date").value = item.startDate[1];
		$("supplyList").value = item.supplyList[1];
		
		//remove initial save item listener
		submit.removeEventListener("click", storeData);
		//change submit button to edit
		$("submit").value = "Edit Project";
		var editSubmit = $("submit");
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;		
		
	}
	
	function deleteItem(){
		var ask = confirm("Are you sure you want to delete this project?");
		if (ask){
			localStorage.removeItem(this.key);
			window.location.reload();
			alert("Project was deleted");
		} else {
			alert("Project was NOT deleted");
		}
	}
	
	function clearLocal(){
		if(localStorage.length === 0){
			alert("There is no data to clear!");
		} else{ 
			localStorage.clear();
			alert("Your data has been cleared");
			window.location.reload();
			return false;
		}
	};
	
	function validate(e){
		var	getType = $("types");
		var getName = $("projectName");
		var getBudget = $("projectBudget");
		
		errMsg.innerHTML = "";
			getType.style.border = "1px solid black";
			getName.style.border = "1px solid black";
			getBudget.style.border = "1px solid black";
		
		var messageAry = [];
		
		if(getType.value === "--Choose A Type--"){
			var typeError = "Please Choose A Type."
			getType.style.border = "1px solid red"
			messageAry.push(typeError);
			
		}
		
		if (getName.value ===""){
			var nameError = "Please enter a project name."
			getName.style.border = "1px solid red"
			messageAry.push(nameError);
		}
		if (getBudget.value ===""){
			var budgetError = "Please enter a project budget."
			getBudget.style.border = "1px solid red"
			messageAry.push(budgetError);
		}
		if (messageAry.length >=1){
			for (var i=0, j=messageAry.length; i<j; i++){
			var txt = document.createElement("li");
			txt.innerHTML = messageAry[i];
			errMsg.appendChild(txt);
			}
			e.preventDefault();	
		return false;
		} else{
			storeData(this.key);
		}
		
	}
	
	
	// Construction types array for drop down menu
	var constructionTypes = ["--Choose A Type--", "Industrial", "Commercial", "Residential", "Multi-Family"];
	var	locationValue;
	var errMsg = $("errors");
	makeCats();
	
	//set link and submit click events
	var submit = $("submit");
	submit.addEventListener("click", validate);
	var displayData = $("displayData");
	displayData.addEventListener("click", getData);
	var clearData = $("clearData");
	clearData.addEventListener("click", clearLocal);
	

















});