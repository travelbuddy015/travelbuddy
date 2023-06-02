const { promises: fsPromises } = require('fs');
                async function asyncReadFile(filename) {
                    try {
                        const contents = await fsPromises.readFile(filename, 'utf-8');

                        const cities = contents.split(",");

                        console.log(cities); 

                        return arr;
                    } catch (err) {
                        console.log(err);
                    }
                }
                asyncReadFile('../file/cities.txt');
                    
                    const datalist = document.getElementById("destinationOptions");
                    // Function to generate datalist options
                    function generateOptions() {
                        datalist.innerHTML = ""; // Clear existing options

                        cities.forEach((city) => {
                            const option = document.createElement("option");
                            option.value = city;
                            datalist.appendChild(option);
                        });
                    }
                    generateOptions();
                    const form = document.getElementById("myForm");
                    form.addEventListener("submit", function (event) {
                        const destinationInput = document.getElementById("destinationInput");
                        const selectedOption = document.querySelector("#destinationOptions option[value='" + destinationInput.value + "']");
                        const startdate = new Date(document.getElementById('startdate').value)
                        const enddate = new Date(document.getElementById('enddate').value)
                        if (!selectedOption) {
                            event.preventDefault();
                            alert("Please select a valid city from the options.");
                        }
                        if (startdate >= enddate) {
                            event.preventDefault()
                            alert("Please select a valid date.")
                        }
                    });

                    // Invalid date
                    form.addEventListener("submit", (event) => {

                    })
