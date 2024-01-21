import amqp from "amqplib";
import { RABBITMQ_URL } from "../config/envConfig.js";

async function connectRabbitMQ() {
  try {
    // Replace with your RabbitMQ server URL
    const connection = await amqp.connect(RABBITMQ_URL);
    console.log("Successfully connected to RabbitMQ");
    return connection;
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
  }
}

export default connectRabbitMQ;
