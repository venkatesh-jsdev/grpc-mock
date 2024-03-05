const {promisify} = require("util");
const path = require("path");
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

function getProtoFromPackageDefinition(packageDefinition, packageName) {
  const pathArr = packageName.split(".");
  return pathArr.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, packageDefinition);
}

function createClient({ protoPath, packageName, serviceName, options }, address, creds=grpc.credentials.createInsecure()){
  const pkgDef = grpc.loadPackageDefinition(protoLoader.loadSync(protoPath, options));
  const proto = getProtoFromPackageDefinition(pkgDef, packageName);
  return new proto[serviceName](address, creds);
}

const client = createClient({
  protoPath: path.resolve(__dirname, "./greeter.proto"),
  packageName: "greeter",
  serviceName: "Greeter"
}, "0.0.0.0:50051");

exports.client = client;
exports.hello = promisify(client.hello.bind(client));
exports.goodbye = promisify(client.goodbye.bind(client));
