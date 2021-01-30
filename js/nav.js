

document.addEventListener("DOMContentLoaded", ready);

function ready(){
    var nav = document.getElementById("nav");
    var nav2 = document.getElementById("nav2");
    nav.onclick = handleMenuClick;
    function handleMenuClick()
    {
        if(nav2.style.display == "none")
            nav2.style.display = "block";
        else
            nav2.style.display = "none";
    }
}
    
                    
