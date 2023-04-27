// toastify-custom.js
function showToast(message, type = "info", position) {
  const toastOptions = {
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: position,
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

const showToastWithRedirect = (message, type, position, duration, url) => {
  let count = 0;

  const showToastPerSecond = setInterval(() => {
    let countdownMessage = `${message} ${5 - count}`;
    showToast(countdownMessage, type, position, duration);
    count++;

    if (count === 5) {
      clearInterval(showToastPerSecond);
      setTimeout(() => {
        window.location.href = url;
      }, duration);
    }
  }, 1000); // Interval of 1000 milliseconds (1 second)
};
