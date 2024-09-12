function cliquer(un){

    let div = document.getElementById(un);
    alert(div);
    div.addEventListener("mousedown", function(){
        div.style.backgroundColor="yellow";
    })

}