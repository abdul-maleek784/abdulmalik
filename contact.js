const contactForm = document.querySelector("#contact-message-form");

if (contactForm) {
  const gmailLink = contactForm.querySelector(".gmail-link");
  const nameField = contactForm.querySelector('[name="name"]');
  const emailField = contactForm.querySelector('[name="email"]');
  const topicField = contactForm.querySelector('[name="topic"]');
  const messageField = contactForm.querySelector('[name="message"]');

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

  contactForm.addEventListener("input", updateGmailLink);
  contactForm.addEventListener("change", updateGmailLink);
  gmailLink.addEventListener("click", (event) => {
    if (!contactForm.reportValidity()) {
      event.preventDefault();
      return;
    }

    updateGmailLink();
  });

  updateGmailLink();
}
