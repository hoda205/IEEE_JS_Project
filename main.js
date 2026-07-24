async function getData() {
    
    try{
        const response = await fetch("http://localhost:3000/comments");

        if(!response.ok)
            throw new Error(`Response status: ${response.status}`);

        const result = await response.json();
        console.log(result);

    }catch(error){
        console.log(error.message)
    }
    
}
getData();