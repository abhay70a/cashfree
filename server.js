require("dotenv").config(); // ADD THIS

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 🔒 HIDDEN KEYS (SAFE)
const APP_ID = process.env.APP_ID;
const SECRET_KEY = process.env.SECRET_KEY;

app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const response = await axios.post(
      "https://api.cashfree.com/pg/orders",
      {
        order_amount: Number(amount),
        order_currency: "INR",
        order_id: "order_" + Date.now(),
        customer_details: {
          customer_id: "cust_" + Date.now(),
          customer_phone: "9999999999"
        }
      },
      {
        headers: {
          "x-client-id": APP_ID,
          "x-client-secret": SECRET_KEY,
          "Content-Type": "application/json",
          "x-api-version": "2022-09-01"
        }
      }
    );

    res.json({
      payment_session_id: response.data.payment_session_id
    });

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).send("Error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));