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
    const response = await fetch("/file/cities.txt");
    const data = await response.text();
    const cityNames = data.split("\n").map((city) => city.trim());
    generateOptions(cityNames);
  } catch (error) {
    console.error("Error fetching city names:", error);
  }
}
fetchCityNames();

// section handling
$(document).ready(function () {
  function showSection() {
    var sections = $(".section");
    var hash = window.location.hash;

    sections.removeClass("active");

    var activeSection = $(hash);

    if (activeSection.length > 0) {
      activeSection.addClass("active");
    }
  }

  showSection();

  $(window).on("hashchange", showSection);
});

// scroll up page
window.onload = () => {
  window.scrollTo(0, 0);
};

// Update trip
function isValidCity(city) {
  const options = $("#destinationOptions option");
  // console.log(city);
  // if (city == "") return false;
  return Array.from(options).some((option) => option.value === city);
}
$(document).ready(() => {
  const tripId = $('script[src="/js/planner.js"]').attr("trip-id");

  function isValidCity(city) {
    const options = $("#destinationOptions option");
    console.log("sourceCity:", city);
    return Array.from(options).some((option) => option.value === city);
  }

  // $("#next_city_page").click(function (e) {
  //   e.preventDefault();
  //   const sourceCityInput = $("#box1Content");
  //   const returnCityInput = $("#box2Content");

  //   const sourceCity = sourceCityInput.val();
  //   const returnCity = returnCityInput.val();

  //   if (
  //     !sourceCity.trim() ||
  //     !isValidCity(sourceCity) ||
  //     !returnCity.trim() ||
  //     !isValidCity(returnCity)
  //   ) {
  //     alert("Please select a valid source city from the options.");
  //     return;
  //   }

  //   const data = {
  //     sourceCity: sourceCity,
  //     returnCity: returnCity,
  //     id: tripId,
  //   };

  //   $.ajax({
  //     type: "POST",
  //     url: "/trip/save-city",
  //     data: data,
  //     success: (response) => {
  //       window.location.href = "/trip/edit/" + tripId + "#user-profile";
  //     },
  //     error: (error) => {
  //       // Handle the error response
  //       console.log("Failed to update the trip:", error);
  //       alert("An error occurred while updating the trip.");
  //     },
  //   });
  // });

  $(".select-member").click(function (e) {
    e.preventDefault();
    const selectedMembers = $(this).data("members");
    const type = $(this).data("type");
    const childrenInput = $("#childrenCol");

    if (type === "friends") {
      childrenInput.val("0");
      childrenInput.hide();
    } else {
      childrenInput.show();
    }

    const data = {
      type: type,
      members: selectedMembers,
      id: tripId,
    };
    $.ajax({
      type: "POST",
      url: "/trip/save-member",
      data: data,
      success: (response) => {
        if (type)
          window.location.href = "/trip/edit/" + tripId + "#member-selection";
        else window.location.href = "/trip/edit/" + tripId + "#transportation";
      },
      error: (error) => {
        // Handle the error response
        console.log("Failed to update the trip:", error);
        alert("An error occurred while updating the trip.");
      },
    });
  });

  $("#next_member_selection").click(function (e) {
    e.preventDefault();
    const adults = parseInt($("#adults").val());
    const children = parseInt($("#children").val());
    const data = {
      adults: adults,
      children: children,
      id: tripId,
    };
    $.ajax({
      type: "POST",
      url: "/trip/save-member",
      data: data,
      success: (response) => {
        window.location.href = "/trip/edit/" + tripId + "#transportation";
      },
      error: (error) => {
        // Handle the error response
        console.log("Failed to update the trip:", error);
        alert("An error occurred while updating the trip.");
      },
    });
  });
});

// member increment and decrement
function increment(inputId) {
  const input = document.getElementById(inputId);
  const currentValue = parseInt(input.value);
  if (currentValue <= parseInt(input.getAttribute("max"))) {
    input.value = currentValue + 1;
  }
}
function decrement(inputId) {
  const input = document.getElementById(inputId);
  const currentValue = parseInt(input.value);
  if (currentValue > parseInt(input.getAttribute("min"))) {
    input.value = currentValue - 1;
  }
}
