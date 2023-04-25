document
  .getElementById("upload-form")
  .addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();
  var form = document.getElementById("upload-form");

  var spinner1 = document.getElementById("spinner1");
  spinner1.classList.remove("hidden");
  console.log(randomInvoiceNumber);

  var uploadedFile = document.getElementById("uploadedFile").files[0];
  var reader = new FileReader();
  reader.onloadend = function (e) {
    var fileData = {
      data: e.target.result,
      name: uploadedFile.name,
      randomInvoiceNumber: randomInvoiceNumber,
      email: document.getElementById("email").value,
    };

    google.script.run
      .withSuccessHandler(success)
      .withFailureHandler(function (error) {
        spinner1.classList.add("hidden");
        alert("Error: " + error);
      })
      .processForm(fileData);
  };
  reader.readAsDataURL(uploadedFile);
}

function success() {
  document.getElementById("upload-form").reset();

  let countdown = 5;

  const countdownInterval = setInterval(() => {
    countdown--;
    if (countdown >= 0) {
      Swal.update({
        icon: "success",
        title: "Proof-of-Payment Sent!",
        text: `Redirecting in ${countdown}...`,
      });
    } else {
      clearInterval(countdownInterval);
      window.location.href = "https://www.example.com"; // Replace with your desired URL
    }
  }, 1000);

  Swal.fire({
    icon: "success",
    title: "Proof-of-Payment Sent!",
    text: `Redirecting in ${countdown}...`,
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
}
