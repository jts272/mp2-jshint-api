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

// Create a function to make the request
// Create a function to display the data

async function postForm(e) {
  // Get id of form to pass to FormData obj:
  const form = new FormData(document.getElementById("checksform"));
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
  } else {
    throw new Error(data.error);
  }
}
