import getApiUrl from "./getApiUrl.js";
import showMessage from "./showMessage.js";

function buttonHandler({ button, isBlocked = false }) {
  button.disabled = isBlocked;
}

export default function send() {
  const button = document.querySelector("[data-send-button]");
  const fileInput = document.querySelector("[data-file-choice]");
  const lastRequest = {};

  button.addEventListener("click", async () => {
    const image = fileInput.files[0];

    if (image === undefined) {
      return;
    }

    console.log(fileInput.value);

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
      buttonHandler({ button, isBlocked: true });

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

      const message = `${pred}, probability: ${percent}%`;
      lastRequest.name = image.name;
      lastRequest.size = image.size;
      lastRequest.lastModified = image.lastModified;
      lastRequest.response = message;

      showMessage(message);
    } catch (err) {
      showMessage("The server isn't responding, try again later");
      return;
    } finally {
      buttonHandler({ button });
    }
  });
}
