import connectRabbitMQ from "./connect.js";

async function sendNotification(message) {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  const queue = "notifications";
  console.log("here");
  await channel.assertQueue(queue, {
    durable: false,
  });

  channel.sendToQueue(queue, Buffer.from(message));
  console.log("Sent message to queue:", message);

  setTimeout(() => {
    channel.close();
    connection.close();
  }, 500);
}

export { sendNotification };

// Use this function where dashboard creation logic is handled
// sendNotification('New dashboard created');
