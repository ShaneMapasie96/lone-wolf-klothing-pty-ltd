const contactForm = document.getElementById("contactForm");
const submitButton = document.getElementById("submitButton");
const contactStatus = document.getElementById("contactStatus");
const standardSubmit = document.getElementById("standardSubmit");
let submitting = false;

// A user-controlled fallback lets FormSubmit display any verification page.
standardSubmit.addEventListener("click", function () {
    if (submitting || !contactForm.reportValidity()) return;
    let source = contactForm.querySelector('input[name="_url"]');
    if (!source) {
        source = document.createElement("input");
        source.type = "hidden";
        source.name = "_url";
        contactForm.append(source);
    }
    source.value = window.location.href;
    HTMLFormElement.prototype.submit.call(contactForm);
});

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
    standardSubmit.hidden = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
        // Let the browser encode the form without a JSON Content-Type preflight.
        const payload = new FormData(contactForm);
        payload.set("name", name);
        payload.set("email", email);
        payload.set("phone", phone);
        payload.set("message", message);
        payload.set("_replyto", email);
        payload.set("_template", "table");
        payload.set("_url", window.location.href);
        const response = await fetch("https://formsubmit.co/ajax/lwe16sa@gmail.com", {
            method: "POST",
            headers: { "Accept": "application/json" },
            signal: controller.signal,
            body: payload
        });
        const result = await response.json();
        if (!response.ok || (result.success !== true && result.success !== "true")) {
            throw new Error("Submission was not accepted");
        }
        contactStatus.textContent = "Thank you! Your enquiry has been submitted. Lone Wolf Klothing will get back to you.";
        contactForm.reset();
    } catch (error) {
        contactStatus.textContent = "We couldn't confirm your submission. Your details are still here. You can retry using the standard form below, which opens our form provider's confirmation or verification page. Retrying may send a duplicate if your first attempt reached us. You can also contact us at lwe16sa@gmail.com or +27 61 581 6059.";
        standardSubmit.hidden = false;
    } finally {
        clearTimeout(timeout);
        submitting = false;
        submitButton.disabled = false;
        submitButton.value = "Send Now";
        contactForm.removeAttribute("aria-busy");
    }
});
