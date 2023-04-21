const getContactDetails = async () => {
  const email = document.getElementById("inputEmail").value;
  if (!email) {
    alert("Please enter an email address.");
    return;
  }

  const contact = await fetchContactByEmail(email);
  if (contact) {
    displayContactDetails(contact);
  } else {
    alert("No contact found with this email address.");
  }
};

const fetchContactByEmail = async (email) => {
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("submitbutton").classList.add("hidden");
  try {
    const response = await fetch("/getinfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (response.status === 404) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

let contactInfo = null;

function displayContactDetails(contact) {
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("submitbutton").classList.remove("hidden");

  contactInfo = contact;

  const tableBody = document
    .getElementById("contactTable")
    .getElementsByTagName("tbody")[0];
  tableBody.innerHTML = "";
  const newRow = tableBody.insertRow();

  const firstNameCell = newRow.insertCell(0);
  const lastNameCell = newRow.insertCell(1);
  const addressCell = newRow.insertCell(2);
  const whatsappCell = newRow.insertCell(3);
  const countryCell = newRow.insertCell(4);
  const postalcodeCell = newRow.insertCell(5);

  // Add the classes to each table cell
  ["px-4", "py-2", "border"].forEach((className) => {
    firstNameCell.classList.add(className);
    lastNameCell.classList.add(className);
    addressCell.classList.add(className);
    whatsappCell.classList.add(className);
    countryCell.classList.add(className);
    postalcodeCell.classList.add(className);
  });

  firstNameCell.innerHTML = contact.properties.firstname
    ? contact.properties.firstname
    : "No Data";
  lastNameCell.innerHTML = contact.properties.lastname
    ? contact.properties.lastname
    : "No Data";
  addressCell.innerHTML = contact.properties.address
    ? contact.properties.address
    : "No Data";
  whatsappCell.innerHTML = contact.properties.hs_whatsapp_phone_number
    ? contact.properties.hs_whatsapp_phone_number
    : "No Data";
  countryCell.innerHTML = contact.properties.country
    ? contact.properties.country
    : "No Data";
  postalcodeCell.innerHTML = contact.properties.zip
    ? contact.properties.zip
    : "No Data";
}

const generateInvoice = async () => {
  if (!contactInfo) {
    alert("Please search for a contact first.");
    return;
  }

  document.getElementById("visaloading").classList.remove("hidden");
  document.getElementById("VisaButton").classList.add("hidden");

  // Get the required data for generating the invoice (e.g., visaservice, priority)
  const visaservice = document.getElementById("mySelectVS").value;
  const priority = document.getElementById("mySelectP").value;
  const randomNumber = Math.floor(Math.random() * 9000 + 1000);
  const randomInvoiceNumber = "VISA-" + randomNumber;
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
    const requestData = {
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

    const response = await fetch("/generateInvoice", {
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
    console.log("Download URL:", data.url.url);
    downloadButton.target = "_blank";
    downloadButton.classList.remove("hidden");
    document.getElementById("visaloading").classList.add("hidden"); // Add this line to show the button
  } catch (error) {
    console.error("Error:", error);
    const formvisa = document.getElementById("VV");
    formvisa.resetform;
  }
};

const generateInvoiceButtonVisa = document.getElementById("VisaButton");
generateInvoiceButtonVisa.addEventListener("click", generateInvoice);

const value = document.querySelector("#values");
const input = document.querySelector("#days");
value.textContent = input.value;
input.addEventListener("input", (event) => {
  value.textContent = event.target.value;
});

document.getElementById("mpa").addEventListener("change", showdays);

function showdays() {
  var mpa = document.getElementById("mpa");
  var rangediv = document.getElementById("range");

  if (mpa.checked) {
    rangediv.classList.remove("hidden");
  } else {
    rangediv.classList.add("hidden");
  }
}

let formSelect = document.getElementById("generator");
let visaForm = document.getElementById("VisaServices");
let addOnsForm = document.getElementById("addOnServices");

formSelect.addEventListener("change", function () {
  if (formSelect.value === "visa") {
    visaForm.classList.remove("hidden");
    addOnsForm.classList.add("hidden");
  } else {
    visaForm.classList.add("hidden");
    addOnsForm.classList.remove("hidden");
  }
});
