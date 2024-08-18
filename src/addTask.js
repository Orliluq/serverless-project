const { v4 } = require("uuid");
const AWS = require("aws-sdk");

const middy = require("@middy/core");
const httpJSONBodyParser = require("@middy/http-json-body-parser");

const addTask = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  const { title, description } = JSON.parse(event.body);
  const createdAt = new Date().toISOString(); 
  const id = v4();

  console.log("created id: ", id);

  const newTask = {
    id,
    title,
    description,
    createdAt,
    done: false,
  };

  try {
    await dynamodb
      .put({
        TableName: "TaskTable",
        Item: newTask,
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(newTask),
    };
  } catch (error) {
    console.error("Error adding task:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};

module.exports = {
  addTask: middy(addTask).use(httpJSONBodyParser()),
};