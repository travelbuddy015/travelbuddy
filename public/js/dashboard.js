const datalist = document.getElementById("destinationOptions");

// Function to generate datalist options
function generateOptions(cities) {
  datalist.innerHTML = ""; // Clear existing options

  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    datalist.appendChild(option);
  });
}

// Fetch the cityname
async function fetchCityNames() {
  try {
    const response = await fetch("./file/cities.txt");
    const data = await response.text();
    const cityNames = data.split("\n").map((city) => city.trim());
    generateOptions(cityNames);
  } catch (error) {
    console.error("Error fetching city names:", error);
  }
}
fetchCityNames();

const form = document.getElementById("myForm");
form.addEventListener("submit", function (event) {
  const destinationInput = document.getElementById("destinationInput");
  destinationInput.value =
    destinationInput.value.charAt(0).toUpperCase() +
    destinationInput.value.slice(1);
  const selectedOption = document.querySelector(
    "#destinationOptions option[value='" + destinationInput.value + "']"
  );
  if (!selectedOption) {
    event.preventDefault();
    alert("Please select a valid city from the options.");
  }
});
