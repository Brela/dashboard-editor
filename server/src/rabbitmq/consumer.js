import connectRabbitMQ from "./connect.js";

async function startConsumer() {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  const queue = "notifications";

  await channel.assertQueue(queue, {
    durable: false,
  });

  console.log("Waiting for messages in queue:", queue);

  channel.consume(queue, (message) => {
    if (message !== null) {
      console.log("Received:", message.content.toString());
      // Here, integrate your email or SMS service to send the notification
      channel.ack(message);
    }
  });
}

export default startConsumer;
