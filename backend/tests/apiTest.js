const http = require("http");

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/products",
  method: "GET",
};

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log("Status Code:", res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log("Response Keys:", Object.keys(json));
      if (json.products) {
        console.log("Products Count:", json.products.length);
        if (json.products.length > 0) {
          console.log("First Product:", json.products[0].productName);
        }
      } else {
        console.log("No products array in response");
      }
    } catch (e) {
      console.log("Failed to parse response:", e.message);
      console.log("Raw Data:", data.substring(0, 100));
    }
  });
});

req.on("error", (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
