function handleSubmit(event) {
  event.preventDefault();
  const message = document.getElementById("form-message");
  if (!message) return;
  message.textContent = "Merci ! Votre message a été envoyé (démonstration).";
}
