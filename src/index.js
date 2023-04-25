let formSelect = document.getElementById("generator");
let visaForm = document.getElementById("visaservicesFormContainer");
let addOnsForm = document.getElementById("addonFormContainer");
let uploadForm = document.getElementById("uploadFormContainer");

formSelect.addEventListener("change", function () {
  if (formSelect.value === "visa") {
    visaForm.classList.remove("hidden");
    addOnsForm.classList.add("hidden");
    uploadForm.classList.add("hidden");
  } else if (formSelect.value === "addOns") {
    visaForm.classList.add("hidden");
    addOnsForm.classList.remove("hidden");
    uploadForm.classList.add("hidden");
  } else if (formSelect.value === "payProof") {
    visaForm.classList.add("hidden");
    addOnsForm.classList.add("hidden");
    uploadForm.classList.remove("hidden");
  } else {
    visaForm.classList.add("hidden");
    addOnsForm.classList.add("hidden");
    uploadForm.classList.add("hidden");
  }
});

// Function to load the form content and inject it into the container

async function loadForm(formName, callback) {
  const response = await fetch(formName + ".html");
  const formContent = await response.text();
  document.getElementById(formName + "Container").innerHTML = formContent;

  if (callback) {
    callback();
  }
}

// Load the forms
loadForm("addonForm", () => {
  // Add the content of addon.js here
  const value2 = document.getElementById("AccommodationValue");
  const input2 = document.getElementById("AccommodationDays");
  value2.textContent = input2.value;

  input2.addEventListener("input", (event) => {
    value2.textContent = event.target.valueAsNumber;
  });

  const value = document.getElementById("values");
  const input = document.getElementById("days");
  value.textContent = input.value + " days";
  input.addEventListener("input", (event) => {
    value.textContent = event.target.value;
  });

  const mpaCheckbox = document.getElementById("mpa");
  mpaCheckbox.addEventListener("change", showdays);

  const philAccommodationSelect = document.getElementById("pas");
  philAccommodationSelect.addEventListener("change", showdays);

  function showdays() {
    var mpa = document.getElementById("mpa");
    var rangediv = document.getElementById("range");
    var pas = document.getElementById("range1");
    var pasvalue = document.getElementById("pas").value;

    if (mpa.checked) {
      rangediv.classList.remove("hidden");
    } else {
      rangediv.classList.add("hidden");
    }

    if (pasvalue === "Option 1" || pasvalue === "Option 2") {
      pas.classList.remove("hidden");
    } else {
      pas.classList.add("hidden");
    }
  }
});
loadForm("visaservicesForm", () => {});

loadForm("uploadForm", () => {});
