const AddOnGenerateInvoice = async () => {
  if (!contactInfo) {
    alert("Please search for a contact first.");
    return;
  }

  document.getElementById("addOnLoading").classList.remove("hidden");
  document.getElementById("AddOnButton").classList.add("hidden");

  const email = document.getElementById("inputEmail").value;

  var rentaflight = document.getElementById("raf").value;
  var HotelAccommR = document.querySelector("#har");

  if (HotelAccommR.checked) {
    var HotelAccommR = document.querySelector("#har").value;
  } else {
    HotelAccommR = "";
  }

  console.log(HotelAccommR);

  var philAccommodation = document.getElementById("pas").value;

  if (philAccommodation === "Option 1" || philAccommodation === "Option 2") {
    var philAccommodation = document.getElementById("pas").value;
    var pasDays = document.getElementById("AccommodationDays").value;
  } else {
    philAccommodation = "";
    pasDays = "";
  }
  console.log(pasDays);

  var manilaPA = document.querySelector("#mpa");

  if (manilaPA.checked) {
    var manilaPA = document.querySelector("#mpa").value;
    var manilapadays = document.getElementById("days").value;
  } else {
    manilaPA = "";
    manilapadays = "";
  }

  console.log(manilaPA);
  console.log(manilapadays);

  // Get the required data for generating the invoice (e.g., visaservice, priority)
  const randomNumber = Math.floor(Math.random() * 9000 + 1000);
  const randomInvoiceNumber = "AO-" + randomNumber;
  const currency = document.getElementById("Currency1").value;
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
    const dataAddOn = {
      action: "AddOnForm",
      email,
      firstname,
      lastname,
      address,
      country,
      currency,
      rentaflight,
      HotelAccommR,
      philAccommodation,
      pasDays,
      manilaPA,
      manilapadays,
      randomInvoiceNumber,
      customerID,
      postalcode,
    };

    console.log("Request data:", dataAddOn);
    console.log("Request data:", email);

    const response1 = await fetch("/AddOnGenerateInvoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataAddOn),
    });
    const data = await response1.json();
    console.log("Success:", data);

    const downloadButton = document.getElementById("downloadInvoice2");
    downloadButton.innerText = "Download Invoice";
    downloadButton.href = data.url.url;
    downloadButton.target = "_blank";
    downloadButton.classList.remove("hidden");
    document.getElementById("addOnLoading").classList.add("hidden"); // Add this line to show the button
  } catch (error) {
    alert("Error generating invoice. Please try again.");
    const formvisa = document.getElementById("addOns");
    formvisa.reset();
  }
};
