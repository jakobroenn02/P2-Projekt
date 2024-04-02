document.getElementById("leave-event-id").addEventListener("click", function(e) {
    e.preventDefault();
    const eventId = document.querySelector('input[name="eventId"]').value;
    fetch('/user/leave-event', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({eventId}),
    })
    .then((response) => response.text())
    .then((data) => {console.log(data); 
        window.location.href = '/user/events';
    })
})
    