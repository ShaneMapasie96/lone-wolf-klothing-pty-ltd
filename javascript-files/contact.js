const contactForm = document.getElementById("contactForm");
const submitButton = document.getElementById("submitButton");
const contactStatus = document.getElementById("contactStatus");
let submitting = false;

contactForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    if (submitting || !contactForm.reportValidity()) return;

    const name = document.getElementById("nameInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();
    const phone = document.getElementById("phoneInput").value.trim();
    const message = document.getElementById("messageInput").value.trim();
    if (!name || !email || !message || !/^[+\d\s().-]+$/.test(phone) || phone.replace(/\D/g, "").length < 7 || phone.replace(/\D/g, "").length > 15) {
        contactStatus.textContent = "Please enter your name, email, a valid phone number and message.";
        return;
    }
    if (contactForm.elements.namedItem("_honey").value) return;

    submitting = true;
    submitButton.disabled = true;
    submitButton.value = "Sending...";
    contactForm.setAttribute("aria-busy", "true");
    contactStatus.textContent = "Sending your enquiry...";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
        const response = await fetch("https://formsubmit.co/ajax/lwe16sa@gmail.com", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
                name, email, phone, message,
                _replyto: email,
                _subject: "Lone Wolf Klothing enquiry / callback request",
                _template: "table",
                _url: window.location.href
            })
        });
        const result = await response.json();
        if (!response.ok || (result.success !== true && result.success !== "true")) {
            throw new Error("Submission was not accepted");
        }
        contactStatus.textContent = "Thank you! Your enquiry has been submitted. Lone Wolf Klothing will get back to you.";
        contactForm.reset();
    } catch (error) {
        contactStatus.textContent = "We couldn't confirm your submission. Your details are still here. Please try again, or contact us at lwe16sa@gmail.com or +27 61 581 6059.";
    } finally {
        clearTimeout(timeout);
        submitting = false;
        submitButton.disabled = false;
        submitButton.value = "Send Now";
        contactForm.removeAttribute("aria-busy");
    }
});
