function dropdown_funktion(){
    document.getElementById("mydropdown").classList.toggle("show")
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')){
        var dropdown = document.getElementsByClassName("dropdown-content");
        var i
        for (i= 0; i < dropdown.length; i++) {
            var opendropdown = dropdown[i];
            if (opendropdown.classList.contains('show')){
                opendropdown.classList.remove('show');
            } 
            
        }
    }
}
