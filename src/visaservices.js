const VisaGenerateInvoice = async () => {
  console.log("VisaGenerateInvoice function called");

  if (!contactInfo) {
    alert("Please search for a contact first.");
    return;
  }

  document.getElementById("visaloading").classList.remove("hidden");
  document.getElementById("VisaButton").classList.add("hidden");
  const email = document.getElementById("inputEmail").value;

  // Get the required data for generating the invoice (e.g., visaservice, priority)
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

  console.log("Customer ID:", customerID);

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

    console.log("Request data:", requestData);

    const response = await fetch("/VisaGenerateInvoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    const data = await response.json();
    console.log("Success:", data);

    const downloadButton = document.getElementById("downloadInvoice");
    downloadButton.innerText = "Download Invoice";
    downloadButton.href = data.url.url;
    downloadButton.target = "_blank";
    downloadButton.classList.remove("hidden"); // Show the download button
    document.getElementById("visaloading").classList.add("hidden");

    // Add this line to show the button
  } catch (error) {
    alert("Error generating invoice. Please try again.");
    location.reload();
    document.getElementById("visaloading").classList.remove("hidden");
  }
};

function initializeVisaServicesForm() {
  console.log("Initializing Visa Services Form");

  const generateInvoiceButtonVisa = document.getElementById("VisaButton");
}

document.addEventListener("DOMContentLoaded", initializeVisaServicesForm);
