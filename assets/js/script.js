const API_KEY = "-n7IsnDZxRCiYr5xF2TNDAeL8Uk";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(
  document.getElementById("resultsModal")
);

document
  .getElementById("status")
  .addEventListener("click", (event) => getStatus(event));

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
  // required from the SWAPI API documentation for GET requests.
  const queryString = `${API_URL}?api_key=${API_KEY}`;
  // Call the fetch request:
  const response = await fetch(queryString);
  // Convert to JSON (also a promise we must await):
  const data = await response.json();

  // Check the 'ok' property of the response obj
  if (response.ok) {
    console.log(data.expiry);
  }
}
