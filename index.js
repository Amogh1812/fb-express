const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const url =
  "mongodb+srv://amoghp44:tmkc696969@cluster0.skepep6.mongodb.net/?retryWrites=true&w=majority"; // Replace with the correct MongoDB server URL
const dbName = "fbapp"; // Replace with the correct database name
app.get("/", async (req, res) => {
  try {
    res.json({
      status: 200,
      message: "Get data has been successfull",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

app.post("/create", async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    feedback: req.body.feedback,
  };

  if (!data.name || !data.email || !data.feedback) {
    return res.status(400).send("Incomplete data provided");
  }

  try {
    await MongoClient.connect(url, (err, client) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error connecting to the database");
      }

      const db = client.db(dbName);

      db.collection("Students").findOne(
        { email: data.email },
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error querying the database");
          }

          if (result) {
            console.log("Email already exists");
            return res.status(409).send("Email already exists");
          } else {
            db.collection("Students").insertOne(data, (err, result) => {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .send("Error inserting data into the database");
              } else {
                console.log("Data added");
                return res.status(201).send("Data added");
              }
            });
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
});
app.get("/read", async (req, res) => {
  try {
    await MongoClient.connect(url, (err, client) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error connecting to the database");
      }

      const db = client.db(dbName);

      db.collection("Students")
        .find({})
        .toArray((err, result) => {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        });
    });
  } catch (err) {
    console.log(err);
  }
});
app.delete("/remove", async (req, res) => {
  try {
    await MongoClient.connect(url, (err, client) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error connecting to the database");
      }

      const db = client.db(dbName);
      const data = { email: req.body.email };

      db.collection("Students").deleteOne(data, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
});
app.put("/change", (req, res) => {
  MongoClient.connect(url, (err, client) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error connecting to the database");
    }

    const db = client.db(dbName);
    const data = { name: req.body.name, feedback: req.body.feedback };

    db.collection("Students").updateOne(
      { email: req.body.email },
      { $set: data },
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      }
    );
  });
});
const PORT = process.env.PORT || 9999; // Replace with the desired port number
// if (port =="production") {
//   app.use(express.static("build"));
// }
app.listen(PORT, () => {
  console.log(`Server ready @${PORT}`);
});
