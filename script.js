function convertNumber() {
    const number = document.getElementById("numberInput").value.trim();
    const conversionType = document.getElementById("conversionType").value;

    if (!number) {
        showModal("Please enter a number");
        return;
    }

    const url = "https://proxy.cors.sh/https://www.dataaccess.com/webservicesserver/numberconversion.wso";

    let bodyContent = "";
    if (conversionType === "NumberToWords") {
        bodyContent = `<ubiNum>${number}</ubiNum>`; // integer only
    } else if (conversionType === "NumberToDollars") {
        bodyContent = `<dNum>${number}</dNum>`; // decimal allowed
    }

    const soapRequest =
        `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <${conversionType} xmlns="http://www.dataaccess.com/webservicesserver/">
              ${bodyContent}
            </${conversionType}>
          </soap:Body>
        </soap:Envelope>`;

    fetch(url, {
        method: "POST",
        headers: {
            'x-cors-api-key': 'temp_cae2e83cc8fd70ff19a1de0ededbca09',
            "Content-Type": "text/xml; charset=utf-8",
            "SOAPAction": `http://www.dataaccess.com/webservicesserver/${conversionType}`
        },
        body: soapRequest
    })
    .then(res => res.text())
    .then(data => {
        console.log("SOAP Response:", data);

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");

        // Check for SOAP Fault
        const faultString = xmlDoc.getElementsByTagName("faultstring")[0];
        if (faultString) {
            document.getElementById("result").innerText = "Error: " + faultString.textContent;
            return;
        }

        // Extract result using tag name without worrying about namespace prefixes
        const resultTag = conversionType === "NumberToWords"
            ? "NumberToWordsResult"
            : "NumberToDollarsResult";

        const resultElement = xmlDoc.getElementsByTagName(resultTag)[0] ||
                              xmlDoc.getElementsByTagNameNS("*", resultTag)[0];

        if (resultElement && resultElement.textContent.trim()) {
            document.getElementById("result").innerText = "Result: " + resultElement.textContent;
        } else {
            document.getElementById("result").innerText = "Error: No valid result returned. Please check your input.";
        }
    })
    .catch(err => {
        console.error("Network or Fetch Error:", err);
        document.getElementById("result").innerText = "Error: Unable to reach the service.";
    });
}

document.getElementById("conversionType").addEventListener("change", function() {
    let button = document.querySelector("button");
    let input = document.getElementById("numberInput");
    
    if (this.value === "NumberToWords") {
        button.style.background = "#a0c4ff"; // soft blue
        input.style.background = "#f0f8ff";
    } else {
        button.style.background = "#c6ffa5ff"; // soft green
        input.style.background = "#fff5e1";
    }
});

function showModal(message) {
    document.getElementById("modalMessage").innerText = message;
    document.getElementById("customModal").style.display = "block";
}

// Close modal when clicking "X"
document.getElementById("closeModal").onclick = function() {
    document.getElementById("customModal").style.display = "none";
};

// Close modal when clicking outside the box
window.onclick = function(event) {
    if (event.target === document.getElementById("customModal")) {
        document.getElementById("customModal").style.display = "none";
    }
};

