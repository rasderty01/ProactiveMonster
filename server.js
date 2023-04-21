const hubspot = require("@hubspot/api-client");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const open = async (url) => {
  const { default: open } = await import("open");
  open(url);
};

if (!process.env.ACCESS_TOKEN) {
  throw new Error("Missing ACCESS_TOKEN environment variable.");
}
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const hubspotClient = new hubspot.Client({
  accessToken: ACCESS_TOKEN,
});

const createContact = async (formData) => {
  console.log("");
  console.log("=== Creating a contact in HubSpot using API Client ===");
  try {
    const contactInput = {
      properties: {
        email: formData.email,
        firstname: formData.fname,
        lastname: formData.lname,
        hubspot_owner_id: 805242080,
        hs_whatsapp_phone_number: formData.pnumber,
        address: formData.address,
        zip: formData.pcode,
      },
    };

    const result = await hubspotClient.crm.contacts.basicApi.create(
      contactInput
    );
    console.log(result.id);

    if (result.id != null) {
      return { status: "success", message: "Succesfully Submitted" };
    }
  } catch (e) {
    console.log(e);
    if ((e.body.status = "error")) {
      return { status: "error", message: "Your account already exists!" };
    }
  }
};

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

app.post("/submit", async (req, res) => {
  const formData = req.body;
  const newContact = await createContact(formData);
  if (newContact.status === "success") {
    res.status(200).json(newContact);
  } else {
    res.status(400).json(newContact);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`=== Starting your app on http://localhost:${PORT} ===`)
);
