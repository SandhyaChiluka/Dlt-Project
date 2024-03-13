let li = document.getElementsByClassName("li")
console.log(li[0]);

fetch('dlt.json')
    .then(function(response){
        return response.json();

    })

    .then(function(data){
        for(let i=0;i<6;i++){
            console.log(data[i].title);
            let k=data[i].title
            li[i].textContent=k
        }

    });