import bcrypt from "bcrypt";
import { v1 as uuidv1 } from "uuid";

async function handler(req, res) {
  // Only POST mothod is accepted
  if (req.method === "POST") {
    let response;
    let query;
    let variables;
    let parsedResponse;
    // Getting email and password from body
    const { name, email, password } = req.body;

    // Validate
    if (!email || !email.includes("@") || !password) {
      res.status(422).json({ message: "Invalid Data" });
      return;
    }

    query = `query GetUserByEmailQuery($email: String = "") {
        users(where: {email: {_eq: $email}}) {
          id
          name
        }
      }      
    `;

    variables = { email };
    response = await fetch(process.env.HASURA_GRAPHQL_API, {
      method: "POST",
      headers: { "x-hasura-admin-secret": process.env.HASURA_SECRET },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    parsedResponse = await response.json();

    if ("data" in parsedResponse && parsedResponse.data.users.length > 0) {
      res.status(422).json({ message: "User already exists" });
    }

    query = `mutation InsertNewUser($email: String = "", $name: String = "", $password: String = "", $id: String = "") {
        insert_users(objects: {name: $name, email: $email, password: $password, id: $id}) {
          returning {
            id
          }
        }
      }                    
    `;
    variables = {
      id: uuidv1(),
      name,
      email,
      password: await bcrypt.hash(password, 12),
    };
    response = await fetch(process.env.HASURA_GRAPHQL_API, {
      method: "POST",
      headers: { "x-hasura-admin-secret": process.env.HASURA_SECRET },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    parsedResponse = await response.json();

    if ("errors" in parsedResponse)
      res.status(500).json({ message: parsedResponse.errors[0].message });
    else res.status(201).json({ message: "User created" });
  } else {
    // Response for other than POST method
    res.status(500).json({ message: "Route not valid" });
  }
}

export default handler;
