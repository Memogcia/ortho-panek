import React from "react";
import { useQuery, gql } from "@apollo/client";

const QUERY = gql`
  query MyQuery {
    todos {
      title
      user {
        name
      }
    }
  }
`;

function todos() {
  const { data, loading, error } = useQuery(QUERY);
  console.log("🚀 ~ file: todos.js ~ line 17 ~ todos ~ data", data);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  return <div />;
}

export default todos;
