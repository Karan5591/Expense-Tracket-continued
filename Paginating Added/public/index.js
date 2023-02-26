document.addEventListener('DOMContentLoaded', async function(){

    await axios.get("http://localhost:3000/getAll", {
        credentials:"Same-origin",
    })
    .then (data=>loadHTMLTable(data['data']))

    // fetch("http://localhost:3000/getAll",{
    //     method:"GET",
    //     credentials:"same-origin"
    // })
    // .then(response=>response.json())
    // .then(data=> loadHTMLTable(data['data']));
    
});





document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        console.log(event.target.dataset.id);
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
    }
});

const updateBtn = document.querySelector('#update-row-btn');
const addbtn= document.querySelector('#add-name-button');

addbtn.onclick= function()
    {
        const amountInput= document.querySelector('#amount-input');
        const descriptionInput= document.querySelector('#description-input');
        const categoryInput= document.querySelector('#category-input')
        const amount=amountInput.value;
        const description=descriptionInput.value;
        const category=categoryInput.value;
        
        fetch('http://localhost:3000/insert', {
            credentials:"same-origin",
            headers:
            {
                'Content-type' : 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                amount: amount,
                description: description,
                category: category
            })
        })
        .then((response=>response.json()))
        .then(data=>    (data['data']))
    
    }

    function deleteRowById(id) {
        fetch('http://localhost:3000/delete/' + id, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        });
    }


    function handleEditRow(id) {

       var table= document.getElementById("table");
       for(var i=0;i<table.rows.length; i++)
       {
        table.rows[i].onclick=function()
        {

            document.getElementById("amount-input").value=this.cells[1].innerHTML;
            document.getElementById("description-input").value=this.cells[2].innerHTML;
            document.getElementById("category-input").value=this.cells[3].innerHTML;
            const updateSection = document.querySelector('#update-row');
            updateSection.hidden = false;
            
            
           
            document.querySelector('#amount-input').dataset.id = id;
        }
       }
    }
    
    updateBtn.onclick = function() {
        const amountInput= document.querySelector('#amount-input');
        const descriptionInput= document.querySelector('#description-input');
        const categoryInput= document.querySelector('#category-input')
        const amount=amountInput.value;
        const description=descriptionInput.value;
        const category=categoryInput.value;
    
    
        fetch('http://localhost:3000/update', {
            method: 'PATCH',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                id: amountInput.dataset.id,
                amount: amount,
                description: description,
                category: category
            
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })
    }
    

    function insertRowIntoTable(data)
    {
        const table= document.querySelector('table tbody');
        const isTableData= table.querySelector('.no-data');

        let tableHTML="<tr>";

        for(var key in data)
        {
            if(data.hasOwnProperty(key))
            {
                tableHTML+= `<td>${data[key]}</td>`;
            }
        }
        tableHTML += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    tableHTML += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

        tableHTML+="</tr>";
        if(isTableData)
        {
            table.innerHTML=tableHTML;
        }
        else{
            const newRow=table.insertRow();
            newRow.innerHTML=tableHTML;
        }
    }

function loadHTMLTable(data)
{
    const table=document.querySelector('table tbody')
    
    if(data.length===0)
    {
        table.innerHTML="<tr><td class='no-data' colspan='6'>No Data</td></tr>"
    }
    else
    {
    let tableHTML="";
    data.forEach(function ({expenseID, amount, description, category}){
        
        tableHTML+= "<tr>";
        tableHTML+=`<td>${expenseID}</td>`;
        tableHTML+=`<td>${amount}</td>`;
        tableHTML+=`<td>${description}</td>`;
        tableHTML+=`<td>${category}</td>`;
        tableHTML+=`<td><button class="delete-row-btn" data-id=${expenseID}>Delete</button></td>`;
        tableHTML+=`<td><button class="edit-row-btn" data-id=${expenseID}>Edit</button></td>`;
        tableHTML+="</tr>";
    });
 
    table.innerHTML=tableHTML;
}
}

document.getElementById("rzp-button1").onclick= async function(e)
  {
    const response= await axios.get('http://localhost:3000/Pmembership', 
    {credentials:"same-origin"}) 
     console.log(response.data.success);
   
    var options={
      "key": response.data.success[1],
      "order_id": response.data.success[0],

      "handler": async function (response){
       await axios.post("http://localhost:3000/updatetxnstatus",
       {
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,
        credentials:"same-origin"
      }, 
      {
        headers:{'Content-type' : 'application/json'}})
      alert("Payment Successful");
      },
  };
  const rzp1= new Razorpay(options);
  rzp1.open();
  e.preventDefault();
  rzp1.on('payment.failed', function(response){
    console.log(response)
    alert("Payment not Processed.");
  });
}


//===================TESTING=====================
document.getElementById("TestButton").onclick = async function(e)
{
const promise=await axios.get("http://localhost:4000/")
promise.then(function(response){
    console.log(response)})
promise.catch(err=>console.log(err));
}
