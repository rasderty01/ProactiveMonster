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
  const config = {
    method: "get",
    url: `https://api.hubapi.com/crm/v3/objects/contacts/search?hapikey=${apiKey}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      filterGroups: [
        {
          filters: [
            {
              propertyName: "email",
              operator: "EQ",
              value: email,
            },
          ],
        },
      ],
      properties: ["firstname", "lastname", "address", "whatsapp", "country"],
    },
  };

  try {
    const response = await axios(config);
    if (response.data.results.length > 0) {
      return response.data.results[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const displayContactDetails = (contact) => {
  const table = document.getElementById("contactTable");
  const row = table.insertRow(-1);

  const firstNameCell = row.insertCell(-1);
  const lastNameCell = row.insertCell(-1);
  const addressCell = row.insertCell(-1);
  const whatsappCell = row.insertCell(-1);
  const countryCell = row.insertCell(-1);

  firstNameCell.innerHTML = contact.properties.firstname || "";
  lastNameCell.innerHTML = contact.properties.lastname || "";
  addressCell.innerHTML = contact.properties.address || "";
  whatsappCell.innerHTML = contact.properties.whatsapp || "";
  countryCell.innerHTML = contact.properties.country || "";
};
