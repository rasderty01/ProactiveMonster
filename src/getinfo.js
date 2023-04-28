const hubspot = require("@hubspot/api-client");
require("dotenv").config();
const multer = require("multer");
const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // Set the maximum file size limit (in bytes). In this example, it's 15 MB.
});

if (!process.env.TOKEN) {
  throw new Error("Missing TOKEN environment variable.");
}
const TOKEN = process.env.TOKEN;

const hubspotClient = new hubspot.Client({
  accessToken: TOKEN,
});

const apiKey = TOKEN; // replace with your HubSpot API key

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
      id: [],
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

const createHubspotTask = async (downloadUrl, contactId) => {
  console.log("Initializing createHubspotTask function...");
  console.log("downloadUrl:", downloadUrl);
  console.log("contactId:", contactId);

  const properties = {
    hs_timestamp: new Date().toISOString(),
    hs_task_body: `Click the link to view Generated Invoice: ${downloadUrl}`,
    hubspot_owner_id: "805242080",
    hs_task_subject: "New Invoice generated",
    hs_task_status: "WAITING",
    hs_task_priority: "HIGH",
  };

  const SimplePublicObjectInputForCreate = {
    properties,
    associations: [
      {
        to: { id: contactId },
        types: [
          { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 10 },
        ],
      },
    ],
  };

  const config = {
    method: "post",
    url: "https://api.hubapi.com/crm/v3/objects/tasks",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(SimplePublicObjectInputForCreate),
  };

  try {
    const response = await axios(config);
    console.log("Task created:", response.data);
    return response.data.id;
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

const createPaymentProofTask = async (downloadUrl, contact, body) => {
  console.log("Initializing createHubspotTask function...");
  console.log("downloadUrl:", downloadUrl);
  console.log("contactId:", contact.id);

  const lastname = contact.properties.lastname;
  const firstname = contact.properties.firstname;
  const contactID = contact.id;
  const modeOfPay = body.modeofpayment;
  const referenceID = body.referenceID;

  const properties = {
    hs_timestamp: new Date().toISOString(),
    hs_task_body: `Click the link to view submitted Payment Proof: ${downloadUrl}<br><br>Mode of Payment: ${modeOfPay}<br>Reference ID: ${referenceID}`,
    hubspot_owner_id: "805242080",
    hs_task_subject: `Payment Proof for ${firstname} ${lastname}`,
    hs_task_status: "WAITING",
    hs_task_priority: "HIGH",
  };

  const SimplePublicObjectInputForCreate = {
    properties,
    associations: [
      {
        to: { id: contactID },
        types: [
          { associationCategory: "HUBSPOT_DEFINED", associationTypeId: 10 },
        ],
      },
    ],
  };

  const config = {
    method: "post",
    url: "https://api.hubapi.com/crm/v3/objects/tasks",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify(SimplePublicObjectInputForCreate),
  };

  try {
    const response = await axios(config);
    console.log("Task created:", response.data);
    return response.data.id;
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../dist")));
// Serve static files

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

app.post("/UpdateContactDetails", async (req, res) => {
  const contact = await fetchContactByEmail(req.body.email);

  if (!contact) {
    res
      .status(404)
      .json({ error: "No contact found with this email address." });
    return;
  }

  console.log(contact.id);

  const properties = req.body;
  const contactId = contact.id;

  const config = {
    method: "patch",
    url: `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      properties,
    }),
  };

  try {
    const response = await axios(config);
    console.log(JSON.stringify(response.data, null, 2));
    res.status(200).json(response.data);
  } catch (error) {
    console.error(JSON.stringify(error.response, null, 2));
    res.status(500).json({ error: "Failed to update the contact." });
  }
});

app.post("/VisaGenerateInvoice", async (req, res) => {
  // Retrieve the required data from the request body
  console.log("Request body:", req.body);

  const {
    email,
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
    "https://script.google.com/macros/s/AKfycbxAWLmRc-oqEDlLH4F93Fx5CFlEQx3gW5kXwcmTwadz750AO76GmLCi4iIitblL164Z/exec";

  try {
    const response = await axios.post(
      url,
      {
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
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const contact = await fetchContactByEmail(email);
    console.log("Contact:", contact);
    console.log("Response:", response.data.url);

    if (contact && contact.id) {
      // Create the task
      const taskId = await createHubspotTask(response.data.url, contact.id);
      console.log(`Task with ID ${taskId} created for contact ${contact.id}`);
    }
    // Send the generated invoice URL as a response
    res.status(200).json({ url: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate the invoice." });
  }
});

app.post("/AddOnGenerateInvoice", async (req, res) => {
  // Retrieve the required data from the request body
  console.log("Request body:", req.body);
  const {
    firstname,
    email,
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
  } = req.body;

  // Call the Google Apps Script API to generate the invoice
  // Replace the URL with the correct URL of your deployed Google Apps Script web app
  const url =
    "https://script.google.com/macros/s/AKfycbxAWLmRc-oqEDlLH4F93Fx5CFlEQx3gW5kXwcmTwadz750AO76GmLCi4iIitblL164Z/exec";

  try {
    const response1 = await axios.post(
      url,
      {
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
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const contact = await fetchContactByEmail(email);

    if (contact && contact.id) {
      // Create the task
      const taskId = await createHubspotTask(response1.data.url, contact.id);
      console.log(`Task with ID ${taskId} created for contact ${contact.id}`);
    }

    // Send the generated invoice URL as a response
    res.status(200).json({ url: response1.data });
    // Updated this line
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate the invoice." });
  }
});

app.post("/uploadForm", upload.single("file"), async (req, res) => {
  try {
    // Call the Google Apps Script API to process the file and create the task
    // Replace the URL with the correct URL of your deployed Google Apps Script web app
    const url =
      "https://script.google.com/macros/s/AKfycbxJwR1XyvQ_rkrUS8KX-IjDEE2fjeaIIbs7WGZn0WELxWN89t17LTiZzJSTUVoKcLj9vg/exec";

    const base64FileData = req.file.buffer.toString("base64");

    const response = await axios.post(
      url,
      {
        data: {
          ...req.body,
          fileData: `data:${req.file.mimetype};base64,${base64FileData}`,
          fileName: req.file.originalname,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const contact = await fetchContactByEmail(req.body.email);

    if (contact && contact.id) {
      // Create the task
      const taskId = await createPaymentProofTask(
        response.data.url,
        contact,
        req.body
      );
      console.log(response.data.url);
      console.log(`Task with ID ${taskId} created for contact ${contact.id}`);
    }

    // Send the generated invoice URL as a response
    res.status(200).json({ url: response.data.url });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to process the file and create the task." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`=== Starting your app on http://localhost:${PORT} ===`)
);
