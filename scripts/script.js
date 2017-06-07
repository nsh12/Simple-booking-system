setInterval(increaseBasePrice, 5000);
var setInterval_id = -1;
var is_sale = 0;
var dep_flag = 0;
var arr_flag = 0;
var daysToNewYear;
var basePrice = 12345;	

/* Reverse date to get proper format */
function reverseDate(str) {
	return str.split("-").reverse().join("-");
}
/* Sale message */
function saleMsg() {
	if(sale.style.color == "transparent") sale.style.color="#008000";
	else sale.style.color = "transparent";
}
/* Setting initial information */
function setStartInfo(){
	/*Set current day */
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	if(dd<10) {
		dd='0'+dd
	} 
	if(mm<10) {
		mm='0'+mm
	} 
	today = dd+'-'+mm+'-'+yyyy;
	document.getElementById('datepicker').placeholder = today;
	/* Set start base_price */
	document.getElementById('basePrice').value = basePrice;
	/* Set start currency */
	document.getElementById("Currency").value == "RUR";
}
/* Calendar */
$( function() {
	$.datepicker.setDefaults(
	$.extend($.datepicker.regional["ru"]));
	$( "#datepicker" ).datepicker({minDate:0, dateFormat: 'dd-mm-yy'});
} );
function countDaysToNewYear(){
	var new_year = new Date("2016-12-31");
	var val = reverseDate(document.getElementById('datepicker').value);
	var chosen_date = new Date(val);
	var daysLeft = new_year - chosen_date;
	daysLeft/= 1000;
	daysLeft/= 60;
	daysLeft/= 60;
	daysLeft/= 24;
	daysToNewYear=Math.round(daysLeft);
}
/* Setting baseprice */
function setBasePrice() {
	if(document.getElementById("Currency").value=="RUR"){
		document.getElementById('basePrice').value = basePrice;
	}
	else document.getElementById('basePrice').value = Math.round(basePrice/60);
	var form = document.forms[0];
	var arrive_from = form.elements.arriveFrom;
	var arrive_to = form.elements.arriveTo;
	for(i=0; i<3; i++) {
		if (arrive_from[i].checked && arrive_to[i].checked) {
				document.getElementById('basePrice').value = 0;
				document.getElementById('salePrice').value = 0;
				arrive_from[i].checked=false;
				arrive_to[i].checked=false;
				alert ("Пожалуйста, выберите различные пункты отправления и прибытия");
			}	
	}
}
/* Setting sale price */
function setSalePrice() {
	var basePrice = document.getElementById('basePrice').value;
	var val = "";
	if (document.getElementById('datepicker').value!=0) {
		val = Math.round(Math.abs(basePrice*Math.sin(daysToNewYear)));
	}
	document.getElementById('salePrice').value = val;
}
/* Booking message */
function showBookingMessage() {
	var message_checkbox = document.getElementById("orderMessage");
	if (message_checkbox.checked) alert('Бронь успешно добавлена');
}
/* Filling shopping cart */
var shopping_cart_index = 1;
var shopping_cart_id = 1;
var shopping_cart_existance = 0;
function updateTable() {
	var radios_arrive_from = document.getElementsByName('arriveFrom');
	for (var i = 0, length = radios_arrive_from.length; i < length; i++) {
		if (radios_arrive_from[i].checked) {
			arr_flag = 1;
		}
	}
	var radios_arrive_to = document.getElementsByName('arriveTo');
	for (var i = 0, length = radios_arrive_to.length; i < length; i++) {
		if (radios_arrive_to[i].checked) {
			dep_flag = 1;
		}
	}
	if (arr_flag == 1 && dep_flag == 1) {
		/* sorting */
		var shopping_cart = document.getElementById('shopping_cart');
		shopping_cart.onclick = function(e) {
		if (e.target.tagName != 'TH') return;
			sortShoppingCart(e.target.cellIndex, e.target.getAttribute('data-type'));
		};
		var x = document.getElementById("shopping_cart");
		x.style.display = "block";
		var my_row = x.insertRow(shopping_cart_index);
		var num = my_row.insertCell(0);
		var dep_city = my_row.insertCell(1);
		var arr_city = my_row.insertCell(2);
		var date = my_row.insertCell(3);
		var price = my_row.insertCell(4);
		var reset_button = my_row.insertCell(5);
		num.innerHTML = shopping_cart_id;
		
		for (var i = 0, length = radios_arrive_from.length; i < length; i++) {
			if (radios_arrive_from[i].checked) {
				arr_flag = 1;
				dep_city.innerHTML = radios_arrive_from[i].value;
				break;
			}
		}
		
		for (var i = 0, length = radios_arrive_to.length; i < length; i++) {
			if (radios_arrive_to[i].checked) {
				dep_flag = 1;
				arr_city.innerHTML = radios_arrive_to[i].value;
				break;
			}
		}			
		date.innerHTML = document.getElementById("datepicker").value;
		var sale_price = document.getElementById("salePrice").value;
		//price.innerHTML = sale_price + "\t" +document.getElementById("Currency").value;
		price.innerHTML = sale_price;
		reset_button.innerHTML = '<input type="button" class="cancel_button" src="images/remove.png" value="Отменить" onclick="removeRowFromTable(this)">';
		shopping_cart_id++;
		shopping_cart_index++;
		var base_price = document.getElementById("basePrice").value;
		if (sale_price <= (base_price / 2)) { 
			my_row.style.color="#008000";
			is_sale++;
			if (setInterval_id == -1) {
				setInterval_id = setInterval(saleMsg, 500);
			}
		}
		document.body.scrollTop = document.body.scrollHeight;
	}
	else alert ("Не указаны параметры бронирования");
}
/* Deleting booking information */
function removeRowFromTable(object) {
	var index = object.parentNode.parentNode.rowIndex;
	document.getElementById("shopping_cart").deleteRow(index);
	shopping_cart_index--;
	is_sale--;
	if (is_sale==0) {
		clearInterval(setInterval_id);
		sale.style.color="transparent";
	}
	
}
/* Cookies */
function addArraysToCookies() {
	var array_of_rows = document.getElementById("shopping_cart").rows;
	for (var i = 0; i < array_of_rows.length; i++) {
		var array_of_cells = array_of_rows[i].cells;
		var array_as_string = "";
		for (var j = 0; j < array_of_cells.length - 1; j++) {
			var cell_value = array_of_cells[j].innerHTML;
			if (j < array_of_cells.length - 2) array_as_string += cell_value + ",";
			else array_as_string += cell_value;
		}
		document.cookie = "array" + i + "=" + array_as_string + "\n";
	}
}
/* Recount price with currency */
function changeCurrency (){
	if(document.getElementById("Currency").value=="USD"){
		document.getElementById('basePrice').value = Math.round(document.getElementById('basePrice').value/60);
		if (document.getElementById('basePrice').value!=0) {
			setSalePrice();
		}
	}
	if(document.getElementById("Currency").value=="RUR"){
	document.getElementById('basePrice').value = Math.round(document.getElementById('basePrice').value*60);
		if (document.getElementById('basePrice').value!=0) {
			setSalePrice();
		}
	}
}
/* Increasing baseprice */
function increaseBasePrice(){
	document.getElementById('basePrice').value=Math.round( +document.getElementById('basePrice').value + +document.getElementById('basePrice').value*0.01);
	if (document.getElementById('basePrice').value!=0) {
		setSalePrice();
	}
}
/* Sorting by price */
function sortShoppingCart(colNum, type) {
	var tbody = shopping_cart.getElementsByTagName('tbody')[0];
	var rowsArray = [].slice.call(tbody.rows);
	var compare;
	switch (type) {
		case 'number':
		compare = function(rowA, rowB) {
			return (rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML);
		};
		break;
		case 'string':
		compare = function(rowA, rowB) {
			return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
		};
		break;
	}
	rowsArray.sort(compare);
	shopping_cart.removeChild(tbody);
	for (var i = 0; i < rowsArray.length; i++) {
		tbody.appendChild(rowsArray[i]);
	}
	shopping_cart.appendChild(tbody);
}


