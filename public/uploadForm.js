const uploadFormData = async () => {
  if (!contactInfo) {
    showToast("Please search for a contact first", "warning", "center");

    return;
  }

  const fileInput = document.getElementById("uploadFile");
  const file = fileInput.files[0];

  if (!file) {
    showToast("Please select a file to upload.", "warning", "center");
    return;
  }

  if (!validateFileType(file)) {
    showToast(
      "Invalid file type. Please upload an image (JPEG, PNG, GIF, BMP, WEBP, HEIC) or PDF file.",
      "warning",
      "center"
    );
    return;
  }

  const maxFileSize = 15 * 1024 * 1024; // 5 MB

  if (file.size > maxFileSize) {
    showToast(
      "File size exceeds 15 MB. Please upload a smaller file.",
      "warning",
      "center"
    );
    return;
  }
  document.getElementById("uploadLoading").classList.remove("hidden");
  document.getElementById("uploadButton").classList.add("hidden");

  const email = document.getElementById("inputEmail").value;
  const modeofpayment = document.getElementById("modeOfPay").value;
  const referenceID = document.getElementById("referenceID").value;
  const randomInvoiceNumber = document
    .getElementById("invoiceID")
    .value.toUpperCase();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("email", email);
  formData.append("modeofpayment", modeofpayment);
  formData.append("referenceID", referenceID);
  formData.append("randomInvoiceNumber", randomInvoiceNumber);

  try {
    uploadButton();
    const uploadResponse = await fetch("/uploadForm", {
      method: "POST",
      body: formData,
    });

    if (uploadResponse.ok) {
      const result = await uploadResponse.json();
      const redirectUrl = "https://mgiukgroup.com"; // Replace with the URL you want to redirect to
      const countdownDuration = 5000; // 5 seconds
      showToastWithRedirect(
        "File uploaded successfully. Redirecting in: ",
        "success",
        "center",
        countdownDuration,
        redirectUrl
      );
      document.getElementById("uploadLoading").classList.add("hidden");
      document.getElementById("uploadButton").classList.remove("hidden");
      uploadButton();
    } else {
      showToast("Error uploading file.", "warning", "center");
      uploadButton();
    }
  } catch (error) {
    showToast("Error uploading file.", "error", "center");
    uploadButton();
  }
};

function validateFileType(file) {
  const allowedExtensions = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
    "image/webp",
    "image/heic",
    "application/pdf",
  ];

  return allowedExtensions.includes(file.type);
}
