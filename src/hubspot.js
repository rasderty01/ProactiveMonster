const getContactDetails = async () => {
  const email = document.getElementById("inputEmail").value;
  if (!email) {
    showToast("Please search for a contact first.", "warning", "center");
    return;
  }

  const contact = await fetchContactByEmail(email);
  if (contact) {
    console.log(contact.id);
    displayContactDetails(contact, email);
  } else {
    showToast("Email not found. Try again.", "warning", "center");
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("submitbutton").classList.remove("hidden");
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
    showToast("Error. Please try again.", "warning", "center");
    return null;
  }
};

let contactInfo = null;

function displayContactDetails(contact, email) {
  document.getElementById("loading").classList.add("hidden");
  document.getElementById("submitbutton").classList.remove("hidden");

  console.log("Contact:", email);
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
