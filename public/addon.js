const AddOnGenerateInvoice = async () => {
  if (!contactInfo) {
    showToast("Please search for a contact first", "warning", "center");
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

  var philAccommodation = document.getElementById("pas").value;

  var consultation = document.getElementById("consultation").value;

  if (consultation === "Option 1" || consultation === "Option 2") {
    var consultation = document.getElementById("consultation").value;
  } else {
    consultation = "";
  }

  if (philAccommodation === "Option 1" || philAccommodation === "Option 2") {
    var philAccommodation = document.getElementById("pas").value;
    var pasDays = document.getElementById("AccommodationDays").value;
  } else {
    philAccommodation = "";
    pasDays = "";
  }

  var manilaPA = document.querySelector("#mpa");

  if (manilaPA.checked) {
    var manilaPA = document.querySelector("#mpa").value;
    var manilapadays = document.getElementById("days").value;
  } else {
    manilaPA = "";
    manilapadays = "";
  }

  let priorityService = document.getElementById("priorityService").value;

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

  try {
    const dataAddOn = {
      action: "AddOnForm",
      email,
      firstname,
      lastname,
      address,
      country,
      currency,
      consultation,
      rentaflight,
      priorityService,
      HotelAccommR,
      philAccommodation,
      pasDays,
      manilaPA,
      manilapadays,
      randomInvoiceNumber,
      customerID,
      postalcode,
    };

    const response1 = await fetch("/AddOnGenerateInvoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataAddOn),
    });
    const data = await response1.json();
    showToast("Your Invoice is ready to download!", "success", "center");

    const downloadButton = document.getElementById("downloadInvoice2");
    downloadButton.innerText = "Download Invoice";
    downloadButton.href = data.url.url;
    downloadButton.target = "_blank";
    downloadButton.classList.remove("hidden");
    document.getElementById("addOnLoading").classList.add("hidden"); // Add this line to show the button
  } catch (error) {
    showToast(
      "Error generating invoice. Refreshing page....",
      "error",
      "center"
    );
    location.reload();
  }
};
