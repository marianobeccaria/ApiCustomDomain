import { APIGatewayProxyEvent, Context } from 'aws-lambda';

async function handler(
  // Could use any to support any event and context type
  //event:any, context:any
  event: APIGatewayProxyEvent, context: Context) {

  return {
      statusCode: 200,
      body: 'Hello from Lambda!'
  }
}

export { handler };