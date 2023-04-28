const getContactDetails = async () => {
  const email = document.getElementById("inputEmail").value;
  if (!email) {
    showToast("Please search for a contact first.", "warning", "center");
    return;
  }

  const contact = await fetchContactByEmail(email);
  if (contact) {
    displayContactDetails(contact, email, updateContact);
  } else {
    showToast("Email not found. Try again.", "warning", "center");
    document.getElementById("loading").classList.add("hidden");
    document.getElementById("submitbutton").classList.remove("hidden");
  }
};

const fetchContactByEmail = async (email) => {
  document.getElementById("generators").classList.remove("hidden");
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

    if (response.status === 200) {
      showToast("Success", "success", "right");
    }

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
  document.getElementById("showdetails").classList.remove("hidden");
  console.log("Contact:", email);
  contactInfo = contact;

  // Create spans to display contact details
  const firstNameSpan = contact.properties.firstname
    ? contact.properties.firstname
    : "No First Name";
  const lastNameSpan = contact.properties.lastname
    ? contact.properties.lastname
    : "No Last Name";
  const addressSpan = document.getElementById("addressContainer");
  const whatsappSpan = document.getElementById("whatsappContainer");
  const countrySpan = document.getElementById("countryContainer");
  const postalcodeSpan = document.getElementById("postalCodeContainer");

  const fullname = firstNameSpan + " " + lastNameSpan;

  const fullnameContainer = document.getElementById("fullnameContainer");

  // Set the content of each span

  fullnameContainer.innerText = fullname;

  addressSpan.innerText = contact.properties.address
    ? contact.properties.address
    : "No Address";
  whatsappSpan.innerText = contact.properties.hs_whatsapp_phone_number
    ? contact.properties.hs_whatsapp_phone_number
    : "No WhatsApp Number";
  countrySpan.innerText = contact.properties.country
    ? contact.properties.country
    : "No Country";
  postalcodeSpan.innerText = contact.properties.zip
    ? contact.properties.zip
    : "No Postal Code";

  const inputFields = [
    {
      id: "firstnameInput",
      value: contact.properties.firstname,
      noData: "No First Name",
    },
    {
      id: "lastnameInput",
      value: contact.properties.lastname,
      noData: "No Last Name",
    },
    {
      id: "addressInput",
      value: contact.properties.address,
      noData: "No Address",
    },
    {
      id: "whatsappInput",
      value: contact.properties.hs_whatsapp_phone_number,
      noData: "No WhatsApp Number",
    },
    {
      id: "countryInput",
      value: contact.properties.country,
      noData: "No Country",
    },
    {
      id: "postalcodeInput",
      value: contact.properties.zip,
      noData: "No Postal Code",
    },
  ];

  inputFields.forEach(({ id, value, noData }) => {
    const inputElement = document.getElementById(id);
    inputElement.placeholder = value ? value : noData;

    inputElement.addEventListener("click", () => {
      if (inputElement.placeholder === noData) {
        inputElement.placeholder = "";
      } else {
        inputElement.value = inputElement.placeholder;
      }
    });
  });

  const updateButton = document.getElementById("UpdateButton_");
  updateButton.addEventListener("click", () => {
    const inputValues = inputFields.reduce((acc, { id }) => {
      const inputElement = document.getElementById(id);
      acc[id] = inputElement.value;
      return acc;
    }, {});

    updateContact(inputValues);
  });
}

function updateContactDetails() {
  toggleContainers();
}

function cancelUpdateContactDetails() {
  toggleContainers();
}

function toggleContainers() {
  const contactDetailsContainer = document.getElementById(
    "contactDetailsContainer"
  );
  const updateDetailsContainer = document.getElementById(
    "updateDetailsContainer"
  );

  if (!contactDetailsContainer.classList.contains("hidden")) {
    contactDetailsContainer.classList.remove("opacity-100");
    contactDetailsContainer.classList.add("opacity-0");
    setTimeout(() => {
      contactDetailsContainer.classList.add("hidden");
    }, 300);
  } else {
    contactDetailsContainer.classList.remove("opacity-0");
    contactDetailsContainer.classList.add("opacity-100");
    contactDetailsContainer.classList.remove("hidden");
  }

  if (updateDetailsContainer.classList.contains("hidden")) {
    updateDetailsContainer.classList.remove("hidden");
    setTimeout(() => {
      updateDetailsContainer.classList.remove("opacity-0");
      updateDetailsContainer.classList.add("opacity-100");
    }, 50);
  } else {
    updateDetailsContainer.classList.remove("opacity-100");
    updateDetailsContainer.classList.add("opacity-0");
    setTimeout(() => {
      updateDetailsContainer.classList.add("hidden");
    }, 300);
  }
}

const updateContact = async (inputValues) => {
  document.getElementById("UpdateButton_").classList.add("hidden");
  document.getElementById("loading2").classList.remove("hidden");
  const email = document.getElementById("inputEmail").value;
  const body = {
    email: email,
    firstname: inputValues["firstnameInput"],
    lastname: inputValues["lastnameInput"],
    address: inputValues["addressInput"],
    hs_whatsapp_phone_number: inputValues["whatsappInput"],
    country: inputValues["countryInput"],
    zip: inputValues["postalcodeInput"],
  };

  console.log(body);

  try {
    const response = await fetch("/UpdateContactDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log(response.status);

    if (response.ok) {
      document.getElementById("UpdateButton_").classList.remove("hidden");
      document.getElementById("loading2").classList.add("hidden");
      getContactDetails();
      updateContactDetails();
      showToast("Sucessfully updated contact!", "success", "right");
    }
  } catch (error) {
    showToast("Failed to update contact", "error", "center");
    document.getElementById("UpdateButton_").classList.add("hidden");
    document.getElementById("loading2").classList.remove("hidden");
  }
};
