const express = require("express");
const app = express();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const PORT = process.env.PORT || 4002;

/**
 * Cors to allow api access when running locally.
 */
var cors = require("cors");
app.use(cors());

/**
 * Middleware used for parsing incoming JSON payloads, allowing API endpoints to easily access request data as JavaScript objects.
 */
app.use(express.json());

/**
 * Reads the database file and returns the parsed JSON data.
 * @param {Function} callback - A callback function that handles the response.
 *                              The callback receives two parameters: an error object
 *                              and the parsed JSON data from the database file.
 */
const readDatabase = (callback) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      callback(
        { message: "Failed to read the database file.", error: err },
        null
      );
    } else {
      try {
        const jsonData = JSON.parse(data);
        callback(null, jsonData);
      } catch (error) {
        callback(
          { message: "Failed to parse the database JSON.", error: error },
          null
        );
      }
    }
  });
};

/**
 * Writes the provided data to the database file.
 * @param {Object} data - The data to be written to the file. This should be the
 *                        full JSON object representing the database state.
 * @param {Function} callback - A callback function that handles the response.
 *                              The callback receives an error object if the write
 *                              operation fails.
 */
const writeDatabase = (data, callback) => {
  fs.writeFile("db.json", JSON.stringify(data, null, 2), "utf8", (err) => {
    if (err) {
      callback({
        message: "Failed to write to the database file.",
        error: err,
      });
    } else {
      callback(null);
    }
  });
};

/**
 * Retrieves the entire database content.
 * @route GET /api/db
 * @returns {Object} jsonData - The full content of the database.
 * @returns {number} 200 - The status code for a successful response.
 * @returns {number} 500 - The status code for an internal server error.
 */
app.get("/api/db", (req, res) => {
  readDatabase((err, jsonData) => {
    if (err) {
      console.error(err.message, err.error);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(jsonData);
  });
});

/**
 * Retrieves all users from the database.
 * @route GET /api/users
 * @returns {Object[]} users - An array of user objects.
 * @returns {number} 200 - The status code for a successful response.
 * @returns {number} 500 - The status code for an internal server error.
 */
app.get("/api/users", (req, res) => {
  readDatabase((err, jsonData) => {
    if (err) {
      console.error(err.message, err.error);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ users: jsonData.users });
  });
});

/**
 * Retrieves a single user by their unique ID.
 * @route GET /api/users/:id
 * @param {string} id - The unique identifier of the user.
 * @returns {Object} user - The user object with the specified ID.
 * @returns {number} 200 - The status code for a successful response.
 * @returns {number} 404 - The status code when the user is not found.
 * @returns {number} 500 - The status code for an internal server error.
 */
app.get("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  readDatabase((err, jsonData) => {
    if (err) {
      console.error(err.message, err.error);
      res.status(500).json({ error: err.message });
      return;
    }
    const user = jsonData.users.find((u) => u.id === userId);
    if (user) {
      res.json(user);
    } else {
      res
        .status(404)
        .json({
          error:
            "User not found. Unable to retrieve user with the provided ID.",
        });
    }
  });
});

/**
 * Creates a new user with a unique UUID and adds it to the database.
 * @route POST /api/users
 * @param {Object} req.body - The body of the request containing user details. Accepts { name: 'string', email: 'string'}.
 * @param {string} req.body.name - The name of the user to create.
 * @param {string} req.body.email - The email of the user to create.
 * @returns {Object} user - The newly created user object with id, name, and email fields. { name: 'string', email: 'string', id: 'string'}
 * @returns {number} 201 - The status code for a successful creation.
 * @returns {number} 500 - The status code for an internal server error.
 */
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: uuidv4(), name, email };
  readDatabase((err, jsonData) => {
    if (err) {
      console.error(err.message, err.error);
      res.status(500).json({ error: err.message });
      return;
    }
    jsonData.users.unshift(newUser); // Using unshift instead of push to add at top of database object for easier to see on UI.
    writeDatabase(jsonData, (writeErr) => {
      if (writeErr) {
        console.error(writeErr.message, writeErr.error);
        res.status(500).json({ error: writeErr.message });
        return;
      }
      res.status(201).json(newUser);
    });
  });
});

/**
 * Deletes a user by their unique ID.
 * @route DELETE /api/users/:id
 * @param {string} id - The unique identifier of the user to delete.
 * @returns {Object} confirmation - An object indicating the success of the operation. { success: true }
 * @returns {number} 200 - The status code for a successful deletion. { success: false }
 * @returns {number} 404 - The status code when the user is not found. { success: false }
 * @returns {number} 500 - The status code for an internal server error. { success: false }
 */
app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  readDatabase((err, jsonData) => {
    if (err) {
      console.error(err.message, err.error);
      res.status(500).json({ success: false });
      return;
    }
    const userIndex = jsonData.users.findIndex((u) => u.id === userId);
    if (userIndex > -1) {
      jsonData.users.splice(userIndex, 1);
      writeDatabase(jsonData, (writeErr) => {
        if (writeErr) {
          console.error(writeErr.message, writeErr.error);
          res.status(500).json({ success: false });
          return;
        }
        res.json({ success: true });
      });
    } else {
      res.status(404).json({ success: false });
    }
  });
});

/**
 * Updates a user's name and/or email by their unique ID.
 * @route PATCH /api/users/:id
 * @param {string} id - The unique identifier of the user to update.
 * @param {Object} req.body - The body of the request containing the new user details.
 * @param {string} [req.body.name] - The new name of the user.
 * @param {string} [req.body.email] - The new email of the user.
 * @returns {Object} user - The updated user object.
 * @returns {number} 200 - The status code for a successful update.
 * @returns {number} 404 - The status code when the user is not found.
 * @returns {number} 500 - The status code for an internal server error.
 */
app.patch("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  readDatabase((err, jsonData) => {
    if (err) {
      console.error(err.message, err.error);
      res.status(500).json({ error: err.message });
      return;
    }
    const user = jsonData.users.find((u) => u.id === userId);
    if (user) {
      user.name = name ?? user.name;
      user.email = email ?? user.email;
      writeDatabase(jsonData, (writeErr) => {
        if (writeErr) {
          console.error(writeErr.message, writeErr.error);
          res.status(500).json({ error: writeErr.message });
          return;
        }
        res.json(user);
      });
    } else {
      res
        .status(404)
        .json({
          error:
            "User not found. Update cannot be performed for the provided ID.",
        });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
