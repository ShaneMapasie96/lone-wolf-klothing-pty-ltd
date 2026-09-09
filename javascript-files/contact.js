document.getElementById("submitButton").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default button behavior

    // Get input values
    var name = document.getElementById("nameInput").value;
    var email = document.getElementById("emailInput").value;
    var message = document.getElementById("messageInput").value;

    // Define validation messages array
    var validationMessages = [];

    // Check if input fields are empty
    if (name.trim() === '') {
        validationMessages.push("Please enter your name.");
    }

    if (email.trim() === '') {
        validationMessages.push("Please enter your email address.");
    } else {
        // Check if email is valid using a regular expression
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            validationMessages.push("Please enter a valid email address.");
        }
    }

    if (message.trim() === '') {
        validationMessages.push("Please enter your message.");
    }

    // Display validation messages
    if (validationMessages.length > 0) {
        alert(validationMessages.join('\n'));
        return;
    }

    // Construct message with each input field on its own line
    var fullMessage = "Name: " + name + "\nEmail: " + email + "\nMessage: " + message;

    // Send message to WhatsApp in a new window or tab
    var whatsappURL = "https://wa.me/+27615816059?text=" + encodeURIComponent(fullMessage);
    window.open(whatsappURL, '_blank');
});
