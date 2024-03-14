document.getElementById("leave-event-id").addEventListener("click", function(e) {
    e.preventDefault();
    fetch('/leave-event', {
        method: 'DELETE',
    })
    .then((response) => response.text())
    .then((data) => {console.log(data); location.reload();})})
    