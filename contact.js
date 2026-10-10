// Get the contact form from the page.
const contactForm = document.querySelector("#contact-message-form");

// Only run this code if the form exists on the page.
if (contactForm) {
  // Find the fields and link inside the form.
  const gmailLink = contactForm.querySelector(".gmail-link");
  const nameField = contactForm.querySelector('[name="name"]');
  const emailField = contactForm.querySelector('[name="email"]');
  const topicField = contactForm.querySelector('[name="topic"]');
  const messageField = contactForm.querySelector('[name="message"]');

  // Build a Gmail compose link using the values typed by the user.
  const updateGmailLink = () => {
    const composeUrl = new URL("https://mail.google.com/mail/");
    const subject = topicField.value
      ? `Portfolio message: ${topicField.value}`
      : "Portfolio message";
    const body = [
      `Name: ${nameField.value}`,
      `Email: ${emailField.value}`,
      `Topic: ${topicField.value}`,
      "",
      messageField.value,
    ].join("\n");

    composeUrl.searchParams.set("view", "cm");
    composeUrl.searchParams.set("fs", "1");
    composeUrl.searchParams.set("to", "suleimanabdulmalik784@gmail.com");
    composeUrl.searchParams.set("su", subject);
    composeUrl.searchParams.set("body", body);
    gmailLink.href = composeUrl.toString();
  };

  // Update the Gmail draft whenever the user types or changes a field.
  contactForm.addEventListener("input", updateGmailLink);
  contactForm.addEventListener("change", updateGmailLink);

  // When the user clicks the Gmail link, check the form first to make sure it is valid.
  gmailLink.addEventListener("click", (event) => {
    if (!contactForm.reportValidity()) {
      event.preventDefault();
      return;
    }

    updateGmailLink();
  });

  // Run once at the start so the link is ready when the page loads.
  updateGmailLink();
}
