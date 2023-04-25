// toastify-custom.js
function showToast(message, type = "info") {
  const toastOptions = {
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    className: "rounded-lg shadow-lg text-white",
    style: {
      background: "",
    },
  };

  switch (type) {
    case "success":
      toastOptions.style.background = "rgba(52, 211, 153, 1)";
      break;
    case "error":
      toastOptions.style.background = "rgba(239, 68, 68, 1)";
      break;
    case "warning":
      toastOptions.style.background = "rgba(245, 158, 11, 1)";
      break;
    case "info":
    default:
      toastOptions.style.background = "rgba(59, 130, 246, 1)";
      break;
  }

  Toastify(toastOptions).showToast();
}
