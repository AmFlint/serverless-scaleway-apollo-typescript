exports.handler = async (event, context) => {
  console.log(event);
  return {
    body: JSON.stringify({
      message: 'Hello, Serverless Meetup !'
    }),
    statusCode: 200,
  }
}
