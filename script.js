document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("[data-send-button]");
  const fileInput = document.querySelector("[data-file-choice]");
  const messageElem = document.querySelector("[data-message]");

  function showMessage(msg) {
    if (!messageElem.classList.contains("message-active")) {
      messageElem.classList.add("message-active");
    }

    messageElem.textContent = msg;
  }

  button.addEventListener("click", async () => {
    const image = fileInput.files[0];

    if (image === undefined) {
      showMessage("Choose an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const json = await response.json();
        showMessage(json.detail);
        return;
      }

      const responseJson = await response.json();
      let { pred, prob } = responseJson;
      const percent = Number((prob * 100).toFixed(1));

      showMessage(`${pred}, probability: ${percent}%`);
    } catch (err) {
      showMessage("The server isn't responding, try again later");
      return;
    }
  });
});
