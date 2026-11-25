import getApiUrl from "./getApiUrl.js";
import showMessage from "./showMessage.js";

export default function send() {
  const button = document.querySelector("[data-send-button]");
  const fileInput = document.querySelector("[data-picker-input]");
  const imagePreview = document.querySelector("[data-image-preview]");
  const pickerText = document.querySelector("[data-picker-text]");
  let image = null;
  const lastRequest = {};

  fileInput.addEventListener("change", () => {
    image = fileInput.files[0];

    if (
      lastRequest.name !== image.name &&
      lastRequest.size !== image.size &&
      lastRequest.lastModified !== image.lastModified
    ) {
      showMessage("");
    }

    pickerText.style = "display: none";
    imagePreview.src = URL.createObjectURL(image);
  });

  button.addEventListener("click", async () => {
    if (image === null || image === undefined) {
      return;
    }

    if (
      lastRequest.name === image.name &&
      lastRequest.size === image.size &&
      lastRequest.lastModified === image.lastModified
    ) {
      showMessage(lastRequest.response);
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      showMessage("Analyzing your image...");
      button.disabled = true;

      const response = await fetch(`${getApiUrl()}/predict`, {
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

      let message = `${pred}, probability: ${percent}%`;

      if (pred === "other") {
        message = "It's not a banana!";
      }

      lastRequest.name = image.name;
      lastRequest.size = image.size;
      lastRequest.lastModified = image.lastModified;
      lastRequest.response = message;

      showMessage(message);
    } catch (err) {
      showMessage("The server isn't responding, try again later");
      return;
    } finally {
      button.disabled = false;
    }
  });
}
