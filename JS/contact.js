document.getElementById("contactForm")?.addEventListener("submit", (e) => {
 e.preventDefault();
  const msg = `Hello I would like to be called back.`
  const phone = document.getElementById("phone").value.trim();
  const toast = document.getElementById("toast");
  toast.classList.remove("hide");

  if (!phone || phone.length < 6) {
    toast.textContent = t("toast.phoneInvalid");
  } else {
    toast.textContent = t("toast.callbackOk");
    e.target.reset();
  }

  // const URL =`https://wa.me/0611096473?text=${encodeURIComponent(msg)}`;
  // window.open(URL, "_blank", "noopener"); 
  fetch("https://hook.eu1.make.com/9djgmkfap4lqotr9tx4d5tj9shyy96w8", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phone: phone,
      message: msg
    })
  }).then(response => {
    if (!response.ok) {
      toast.textContent = t("toast.callbackError");
    }
  });

  window.clearTimeout(window.__toastTimer);
  window.__toastTimer = window.setTimeout(
    () => toast.classList.add("hide"),
    4500
  );
});