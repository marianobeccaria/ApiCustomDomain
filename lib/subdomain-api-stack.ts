import { Stack, StackProps } from 'aws-cdk-lib';
import { BasePathMapping, DomainName, EndpointType, LambdaIntegration, RestApi, SecurityPolicy } from 'aws-cdk-lib/aws-apigateway';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { CnameRecord, HostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { join } from 'path';

interface Props extends StackProps {
  apiName: string,
  apiDomainName: string,
  hostedZoneId: string,
  zoneName: string,
  recordName: string,
  certificateArn: string
}

export class SubdomainApiStack extends Stack {

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const helloLambda = new NodejsFunction(this, 'helloLambdaNodeJs', {
      entry: (join(__dirname, '..', 'services', 'lambda', 'hello.ts')),
      handler: 'handler',
      runtime: Runtime.NODEJS_18_X,
    });
    
    const certificate = Certificate.fromCertificateArn(this, 'api-gw-certificate', props.certificateArn);

    const apiDomain = new DomainName(this, 'api-gw-domain-name', {
      domainName: props.apiDomainName,
      certificate,
      securityPolicy: SecurityPolicy.TLS_1_2,
      endpointType: EndpointType.EDGE
  })

    // Create an API Gateway
    const api = new RestApi(this, 'MyTestApi', {
      restApiName: props.apiName,
//      defaultCorsPreflightOptions: {
//        allowOrigins: ["http://localhost:3000"],
//      }
    });

    new BasePathMapping(this, 'api-gw-base-path-mapping', {
      domainName: apiDomain,
      restApi: api
    })

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'hosted-zone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.zoneName
    })

    new CnameRecord(this, 'api-gw-custome-domain-cname-record', {
      recordName: props.recordName,
      zone: hostedZone,
      domainName: apiDomain.domainNameAliasDomainName
    });

    const helloLambadaIntegration = new LambdaIntegration(helloLambda);
    const helloLambdaResource = api.root.addResource('hello');
    helloLambdaResource.addMethod('GET', helloLambadaIntegration);

  }
}
