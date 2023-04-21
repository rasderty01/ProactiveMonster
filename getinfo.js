const hubspot = require("@hubspot/api-client");
require("dotenv").config();
const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

if (!process.env.ACCESS_TOKEN) {
  throw new Error("Missing ACCESS_TOKEN environment variable.");
}
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const hubspotClient = new hubspot.Client({
  accessToken: ACCESS_TOKEN,
});

const apiKey = ACCESS_TOKEN; // replace with your HubSpot API key

const fetchContactByEmail = async (email) => {
  const config = {
    method: "post",
    url: "https://api.hubapi.com/crm/v3/objects/contacts/search",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      filters: [
        {
          propertyName: "email",
          operator: "EQ",
          value: email,
        },
      ],
      properties: [
        "firstname",
        "lastname",
        "address",
        "hs_whatsapp_phone_number",
        "country",
        "zip",
      ],
    }),
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

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

app.post("/getinfo", async (req, res) => {
  const email = req.body.email;
  if (!email) {
    res.status(400).json({ error: "Please enter an email address." });
    return;
  }

  const contact = await fetchContactByEmail(email);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res
      .status(404)
      .json({ error: "No contact found with this email address." });
  }
});

app.post("/generateInvoice", async (req, res) => {
  // Retrieve the required data from the request body
  const {
    visaservice,
    priority,
    randomInvoiceNumber,
    firstname,
    lastname,
    address,
    country,
    currency,
    customerID,
    postalcode,
  } = req.body;

  // Call the Google Apps Script API to generate the invoice
  // Replace the URL with the correct URL of your deployed Google Apps Script web app
  const url =
    "https://script.google.com/macros/s/AKfycbw9WuYDOe2JDgEG2Tmcm5NoG5-Do4PW5aYIgfWGH4sjwoTTWUiIjCN1OaOtJD55ihvoBQ/exec";

  try {
    const response = await axios.post(
      url,
      {
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
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Send the generated invoice URL as a response
    res.status(200).json({ url: response.data }); // Updated this line
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate the invoice." });
  }
});

//app.post("/testGenerateInvoice", async (req, res) => {
// console.log("Request body:", req.body);
//  res.status(200).json({ message: "Request received" });
//});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`=== Starting your app on http://localhost:${PORT} ===`)
);
