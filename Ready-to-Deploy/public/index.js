//=================================Login Page=====================================
const Login=document.getElementById("Sign-in-button")
Login.addEventListener('click', async function ()
{
    
    axios.post("http://localhost:3000/loginUser", 
       
     {
        email:document.getElementsByName("email")[0].value,
        password:document.getElementsByName("password")[0].value
    }
).then(response=>{
    location.replace("/ExpensePage.html")
    
})
.catch(err=>{
    alert(err.response.data);
});
})

//====================================Register User=====================================

const register=document.getElementById("RegisterButton")
register.addEventListener('click', async function ()
{
    
    axios.post("http://localhost:3000/RegisterUser", 
       
     {
        name:document.getElementsByName("name")[0].value,
        email:document.getElementsByName("email")[0].value,
        password:document.getElementsByName("password")[0].value
    }
).then(response=>{
    console.log(response);
    alert(`${response.data}.. Login Now?`);
    location.replace("login.html");
});
})

//======================LOADING PAGE CONTENT===============================

document.addEventListener('DOMContentLoaded', async function(){

    let prevBtnNum=1;
    let nextBtnNum=prevBtnNum+1;
    let tableSize=localStorage.getItem("size");
    document.getElementById("prevButton").innerText=prevBtnNum;
document.getElementById("nextButton").innerText=nextBtnNum;


await axios.get(`http://localhost:3000/getAll?page=0&size=${tableSize}`)
   
.then (response=>{
    const checkpremium =response.data[0].ispremium;
    if(checkpremium=='True')
    {
        document.getElementById('rzp-button1').style.visibility='hidden';
        document.getElementById('premium-message').style.display='block';
    }
    loadHTMLTable( response.data[0].expenses);
    

})
});
document.getElementById("Data-Amount").addEventListener('change', function(event) 
{
    localStorage.setItem("size", document.getElementById("Data-Amount").value);
    location.reload();
})
document.getElementById("prevButton").onclick= async function (e)
{
    let tableSize= document.getElementById("Data-Amount").value;

   let updatePBText= (document.getElementById("prevButton").innerText)-1;
   let updateNBText= (document.getElementById("nextButton").innerText)-1;
   if(updatePBText<1)
   {
    updatePBText+=1;
    updateNBText=parseInt(updatePBText)+ parseInt(1);
   }    
    await axios.get(`http://localhost:3000/getAll?page=${updatePBText}&size=${tableSize}`)
    .then (response=>{const data= response.data[0].expenses;
        loadHTMLTable(data);
    document.getElementById("prevButton").innerText=updatePBText;
    document.getElementById("nextButton").innerText=updateNBText
})

}
document.getElementById("nextButton").onclick= async function (e)
{
    let tableSize= document.getElementById("Data-Amount").value;

    const updatePBText= parseInt(document.getElementById("prevButton").innerText)+parseInt(1);
   const updateNBText= parseInt(document.getElementById("nextButton").innerText)+ parseInt(1);
    await axios.get(`http://localhost:3000/getAll?page=${updatePBText}&size=${tableSize}`)
    .then (response=>{const data= response.data[0].expenses;
    loadHTMLTable(data);
    document.getElementById("prevButton").innerText=updatePBText;
    document.getElementById("nextButton").innerText=updateNBText
})

}


function loadHTMLTable(data)
{
let count=0;
const table=document.querySelector('table tbody')

if(data.length===0)
{
    table.innerHTML="<tr><td class='no-data' colspan='6'>No Data</td></tr>"
}
else
{
let tableHTML="";
    const data1= data[0];
    const {productid, amount, description, category}= data1;
data.forEach(function ({productid, amount, description, category}){
    count++;
    tableHTML+= "<tr>";
   // tableHTML+=`<td>${count}</td>`;
    tableHTML+=`<td>${amount}</td>`;
    tableHTML+=`<td>${description}</td>`;
    tableHTML+=`<td>${category}</td>`
    
    tableHTML+=`<td><button class="delete-row-btn" data-id=${productid}>Delete</button></td>`;
    tableHTML+=`<td><button class="edit-row-btn" id="EditBtn" data-id=${productid}>Edit</button></td>`;
    tableHTML+="</tr>";
});

table.innerHTML=tableHTML;
}
}




//=========================================Add New Data===================================================================================

document.getElementById("add-data-button").onclick= async function(e)
{
    if(document.getElementById("add-data-button").innerText=='Add Data')
    {
        await axios.post('http://localhost:3000/AddExpenseData',
        {
           amount: document.getElementsByName('amount')[0].value,
        description: document.getElementsByName('description')[0].value,
        category: document.getElementsByName('category')[0].value
        }).then(response=>alert(response.data));
        
    }
    
}
//=================================================================Delete Data==================================================



document.querySelector('table tbody').addEventListener('click', function(event) {
if (event.target.className === "delete-row-btn") {
    console.log(event.target.dataset.id);
    deleteRowById(event.target.dataset.id, event.target.dataset.amount );
    console.log(event.target.dataset.amount)
}
if (event.target.className === "edit-row-btn") {
    handleEditRow(event.target.dataset.id);
}
});
async function deleteRowById(id) {
    await axios.delete('http://localhost:3000/DeleteExpense/'+id, {
        })
    .then(data => {
            alert("Data Deleted Successfully")
            location.reload();
        }
    );
}

//====================================================Edit Data===================================================================

const updateBtn = document.getElementById('add-data-button');

function handleEditRow(id) {

   var table= document.getElementById("table");
   for(var i=1;i<table.rows.length; i++)
   {
    table.rows[i].onclick=function(e)
    {

        document.getElementById("amount").value=this.cells[0].innerHTML;
        document.getElementById("description").value=this.cells[1].innerHTML;
        document.getElementById("category").value=this.cells[2].innerHTML;
        document.getElementById("add-data-button").innerText="Update";
    }
   }


updateBtn.addEventListener("click", async function() {
    if(updateBtn.innerText=='Update')
    {

    
    const amountInput= document.querySelector('#amount');
    const descriptionInput= document.querySelector('#description');
    const categoryInput= document.querySelector('#category');
    const amount=amountInput.value;
    const description=descriptionInput.value;
    const category=categoryInput.value;
    await axios('http://localhost:3000/update', {
        
        method: 'PATCH',
        data: ({
            productid: id,
             amount: amount,
            description: description,
            category: category,
        
        })
    })
    .then(data => {
        location.reload();    
        
    })
}
})
}

//===============================================================RazorPay Interface====================================

document.getElementById("rzp-button1").onclick= async function(e)
{
const response= await axios.get('http://localhost:3000/Pmembership') 

console.log(response) // we get order id here
var options={
    
  "key": response.data[1],
  "order_id": response.data[0],

  "handler": async function (response){
   await axios.post("http://localhost:3000/updatetxnstatus",{
   body: {
    order_id: options.order_id,
    payment_id: response.razorpay_payment_id,
    
  }
}) 
  .then(data=>alert("Payment Successful"))
}
}

const rzp1= new Razorpay(options);
rzp1.open();
e.preventDefault();
rzp1.on('payment.failed', function(response){

    axios.post("http://localhost:3000/updatetxnstatus",{
        body: {
    
    payment_id: '0'
    }
    })

    console.log(response)
alert("Payment not Processed.");
});
}


//==================================================LeaderBoard===========================

document.getElementById('Leaderboard').onclick= async function(e)
{
   await axios.get('http://localhost:3000/LeaderBoard')
    .then(response=>{const data=response.data;
    showLeaderboard(data)});

    document.getElementById('table').style.display='none';
    
    document.getElementById('LeaderBoardShow').style.display='block';
}
function showLeaderboard(data)
{
    const list=document.getElementById('thelist')
    data.forEach(function({name, TotalExpense})
    {
        list.innerHTML+=`<li>Name: ${name} &nbsp;&nbsp;&nbsp; Expense Amount: ${TotalExpense} </li>`
    })
 }      


//================================================Download the Expenses.

document.getElementById("downloadExpenses").onclick= async function(e)
{
   
        await axios.get('http://localhost:3000/downloadFile')
    .then((resolve)=>{
        if(resolve.status===200)
        {
            var a=document.createElement("a");
            a.href=resolve.data.getURL;
            a.download='expense.csv';
            a.click();

        }
        else{
            alert(resolve.message);
        }
})
    
   
}

