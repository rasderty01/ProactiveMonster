const VisaGenerateInvoice = async () => {
  if (!contactInfo) {
    showToast("Please search for a contact first", "warning", "center");
    return;
  }

  document.getElementById("visaloading").classList.remove("hidden");
  document.getElementById("VisaButton").classList.add("hidden");
  const email = document.getElementById("inputEmail").value;
  const visaservice = document.getElementById("mySelectVS").value;
  const priority = document.getElementById("mySelectP").value;
  const randomNumber = Math.floor(Math.random() * 9000 + 1000);
  const randomInvoiceNumber = "VISA-" + randomNumber;
  const currency = document.getElementById("Currency").value;
  const lastname = contactInfo.properties.lastname
    ? contactInfo.properties.lastname
    : "";
  const firstname = contactInfo.properties.firstname
    ? contactInfo.properties.firstname
    : "";
  const address = contactInfo.properties.address
    ? contactInfo.properties.address
    : "";
  const country = contactInfo.properties.country
    ? contactInfo.properties.country
    : "";
  const postalcode = contactInfo.properties.zip
    ? contactInfo.properties.zip
    : "";

  const firstLetterOfFirstname = firstname.charAt(0);
  const firstLetterOfLastname = lastname.charAt(0);

  // Create the customerID by concatenating the first letters with the randomInvoiceNumber
  const customerID =
    firstLetterOfFirstname + firstLetterOfLastname + "-" + randomNumber;

  try {
    const requestData = {
      action: "VisaServicesForm",
      email,
      firstname,
      lastname,
      address,
      country,
      currency,
      visaservice,
      priority,
      randomInvoiceNumber,
      customerID,
      postalcode,
    };

    const response = await fetch("/VisaGenerateInvoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    const data = await response.json();
    showToast("Your Invoice is ready to download!", "success", "center");

    const downloadButton = document.getElementById("downloadInvoice");
    downloadButton.innerText = "Download Invoice";
    downloadButton.href = data.url.url;
    downloadButton.target = "_blank";
    downloadButton.classList.remove("hidden"); // Show the download button
    document.getElementById("visaloading").classList.add("hidden");

    // Add this line to show the button
  } catch (error) {
    showToast(
      "Error generating invoice. Refreshing Page....",
      "error",
      "center"
    );
    location.reload();
  }
};
