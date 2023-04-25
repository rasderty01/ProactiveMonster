const uploadFormData = async () => {
  if (!contactInfo) {
    alert("Please search for a contact first");

    return;
  }

  const fileInput = document.getElementById("uploadFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  document.getElementById("uploadLoading").classList.remove("hidden");
  document.getElementById("uploadButton").classList.add("hidden");

  const email = document.getElementById("inputEmail").value;
  const modeofpayment = document.getElementById("modeOfPay").value;
  const referenceID = document.getElementById("referenceID").value;

  console.log(email);

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async function () {
    try {
      const uploadResponse = await fetch("/uploadForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          modeofpayment,
          referenceID,
          fileData: reader.result,
          fileName: file.name,
          randomInvoiceNumber: "AO-6291", // Replace this with the actual randomInvoiceNumber
        }),
      });
      console.log("uploadResponse:", uploadResponse);

      console.log("uploadResponse.ok:", uploadResponse.body);
      console.log("uploadResponse.ok:", uploadResponse.body.fileData);

      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        console.log("File uploaded successfully:", result);
        Toastify({
          text: "File uploaded successfully.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
        }).showToast();
      } else {
        console.error("File upload failed:", uploadResponse);
        Toastify({
          text: "File upload failed.",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
          },
        }).showToast();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      Toastify({
        text: "Error uploading file.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #ff5f6d, #ffc371)",
        },
      }).showToast();
    }
  };
};
