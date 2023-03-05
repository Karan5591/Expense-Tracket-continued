const num1Ele= document.getElementById("num1") as HTMLInputElement ;
const num2Ele= document.getElementById("num2") as HTMLInputElement;
const buttonElement= document.querySelector('button') !;
const numResults: Array<number>=[];
const textResult: string[]=[];

type NumOrString = number | string;
type Result= { val: number; timestamp: Date };


interface ResultObj {
    val: number;
    timestamp: Date;
}


function add(num1: NumOrString, num2: NumOrString)
{
    if(typeof num1==='number' && typeof num2==='number')
    {
        return num1 + num2;
    }
    if(typeof num1==='string' && typeof num2==='string')
    {
        return num1 + '' +num2;
    }

   
}

function printResult(resultObj: ResultObj)
{
    console.log(resultObj.val);
}

buttonElement.addEventListener('click', ()=>{
    const num1= num1Ele.value;
    const num2= num2Ele.value;
    const result= add(+num1, +num2);
    const stringResult= add(num1, num2);
    numResults.push(result as number);
    textResult.push(stringResult as string);
    printResult({val: result as number, timestamp: new Date()})
    console.log(numResults, textResult);
});

const myPromise= new Promise<string>((resolve, reject)=>{
    setTimeout(()=>{
        resolve("It worked");
    }, 1000);
});

myPromise.then((result)=>{
    console.log(result.split('w'));
})