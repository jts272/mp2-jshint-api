const API_KEY = "-n7IsnDZxRCiYr5xF2TNDAeL8Uk";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(
  document.getElementById("resultsModal")
);

// Add event listener to the 'Check Key' button:

document
  .getElementById("status")
  .addEventListener("click", (event) => getStatus(event));

// Add event listener to the 'Run Checks' button:

document
  .getElementById("submit")
  .addEventListener("click", (event) => postForm(event));

// What two things does the getStatus() function need to do?

// MY ANSWERS:

// 1. Open the modal
// 2. Show the validity status of the API key

// My function attempt:

// const getStatus = () => {
//   resultsModal.toggle();
//   const resultsContent = document.getElementById("results-content");
//   resultsContent.textContent("Here are the results from the API status check");
// };

// LESSON ANSWERS:

// 1. Make GET request to the API_URL with the API_KEY
// 2. Pass this data to a display function

// Lesson function:

// When handling promises, we can chain '.then()', or in this instance, use an
// async function. Here, the 'await' keyword is used to await the promise
// becoming true.

async function getStatus(e) {
  // This string is used to pass to the fetch() method. It is ultimately the URL
  // required from the CI JSHint API documentation for GET requests.
  const queryString = `${API_URL}?api_key=${API_KEY}`;
  // Call the fetch request:
  const response = await fetch(queryString);
  // Convert to JSON (also a promise we must await):
  const data = await response.json();

  // Check the 'ok' property of the response obj
  if (response.ok) {
    // Show 'expiry' property of the data obj
    // console.log(data.expiry);
    // Pass this information to the displayStatus function (defined below):
    displayStatus(data.expiry);
  }
  // Show the descriptive 'error' property returned in JSON:
  else {
    // Test error handling by deliberately changing to a wrong API key:
    // ANSWER: Also call the displayExceptions() fn before the throw here:
    displayExceptions(data);
    throw new Error(data.error);
  }
}

function displayStatus(data) {
  // The 'data' param stands in for 'data.expiry' when it is called from the if
  // block of the getStatus function.
  const resultsModalTitle = document.getElementById("resultsModalTitle");
  const resultsContent = document.getElementById("results-content");

  resultsModalTitle.textContent = "API Key Status";
  resultsContent.innerHTML = `
  <p>Your key is valid until:</p>
  <p>${data}</p>
  `;

  resultsModal.show();
}

// Create a function to process the form options, which need to be sent as csv,
// instead of ["option, "name"], ["option", "name"] etc.

// LESSON STEPS:

// 1. Iterate through the options
// 2. Push each value into a temporary array
// 3. Convert the array back to a string

function processOptions(form) {
  // Initialize temporary empty array:
  let optArray = [];
  // If the first key of the entries is 'options' (which it always is here),
  // push the just the value. E.g. ["options", "es6"] will just push "es6".
  for (let entry of form.entries()) {
    if (entry[0] === "options") {
      optArray.push(entry[1]);
    }
  }
  // Use a FormData method to delete all preexisting 'options' occurrences:
  form.delete("options");
  // Now append a 'new' options key, with the array of options. The join()
  // method is used on the completed temporary array to convert it back to a
  // string, and by default, separate values with a comma (csv).
  form.append("options", optArray.join());

  return form;
}

// Create a function to make the request
// Create a function to display the data

async function postForm(e) {
  // Get id of form to pass to FormData obj:
  // const form = new FormData(document.getElementById("checksform"));
  // Change this const to be processed by the processOptions function
  const form = processOptions(
    new FormData(document.getElementById("checksform"))
  );
  // Iterate over the FormData obj to confirm it has captured correctly using
  // built-in FormData methods:
  // for (let entry of form.entries()) {
  //   console.log(entry);
  // }

  // Code copied from CI JSHint docs (add 'await' kw before fetch()).
  // Hardcoded URL reference substituted with the API_URL const:
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: API_KEY,
    },
    // After the headers, this code sends the form data to the API to:
    // 1. Make a POST request to the API
    // 2. Auth it with the API key
    // 3. Attach the form as the body of the request
    body: form,
  });

  // Convert to JSON:

  const data = await response.json();

  if (response.ok) {
    console.log(data);
    // Instead, call displayErrors():
    displayErrors(data);
  } else {
    // throw new Error(data.error);
    // Instead of throwing the error in this else block, call the new
    // displayExceptions() fn.
    displayExceptions(data);
    // ANSWER: throw /after/ calling the above fn:
    throw new Error(data.error);
  }
}

function displayErrors(data) {
  // Set heading:
  let heading = `JSHint Results for ${data.file}:`;
  let results;

  if (data.total_errors === 0) {
    results = `<div class="no_errors">No errors reported!</div>`;
  } else {
    results = `
    <div>
      Total Errors: <span class="error-count">${data.total_errors}</span>
    </div>`;
    // Loop through the error_list (found in the console log) and add each
    // error as a div to display to the user, by adding to the existing results
    // var:
    for (let error of data.error_list) {
      results += `<div>At line <span class="line">${error.line}</span>, `;
      results += `column <span class="column">${error.col}</span></div>`;
      results += `<div class="error">${error.error}</div>`;
    }
  }
  // CHALLENGE:
  // 1. Set heading in modal
  // 2. Set content in modal
  // 3. Display the modal

  // Copied and adjusted from displayStatus()

  // const resultsModalTitle = document.getElementById("resultsModalTitle");
  // const resultsContent = document.getElementById("results-content");

  // resultsModalTitle.textContent = heading;
  // resultsContent.innerHTML = results;

  // document.querySelector("#submit").addEventListener("click", () => {
  //   resultsModal.show();

  // ANSWER:

  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerHTML = results;
  resultsModal.show();
}

// CODEALONG CHALLENGE:

// Build functionality to:
// 1. Keep errors displaying in console (good practice).
// 2. Create displayExceptions() fn to display the exception in the modal.

// Expected output:
// 1. Standard modal with the heading of "An Exception Occurred".
// 2. Contents = status code, error number and error text.

// Questions to ask:
// How do I get the values from JSON data?
// What can I use from preexisting display functions?

// MY FUNCTION

// function displayExceptions(data) {
//   // Keep the code that throws the error in the console:
//   // throw new Error(data.error);

//   console.log(data);

//   // Define modal content:
//   let heading = "An Exception Occurred";
//   let results = "";

//   // console.log(typeof data);
//   // > object

//   for (let [key, value] of Object.entries(data)) {
//     // console.log(`${key}: ${value}`);
//     results += `<div>${key}: ${value}</div>`;
//   }

//   // Copied code to display the modal content:
//   document.getElementById("resultsModalTitle").innerText = heading;
//   document.getElementById("results-content").innerHTML = results;
//   resultsModal.show();
// }

// ANSWER FUNCTION:

// Does not loop entries. Instead uses template literals and accesses the
// relevant object property directly. Allows use of custom formatting this way.

function displayExceptions(data) {
  let heading = `An Exception Occurred`;
  let results;

  results = `<div>The API returned status code ${data.status_code}</div>`;
  results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
  results += `<div>Error text: <strong>${data.error}</strong></div>`;

  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerHTML = results;
  resultsModal.show();
}
