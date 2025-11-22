// crypto-poc/generateKeys.js
const libsignal = require('libsignal-protocol-typescript');

async function makeIdentity() {
  const identityKeyPair = await libsignal.KeyHelper.generateIdentityKeyPair();
  const registrationId = await libsignal.KeyHelper.generateRegistrationId();
  return { identityKeyPair, registrationId };
}

async function run() {
  const a = await makeIdentity();
  const b = await makeIdentity();
  console.log('Alice regId:', a.registrationId);
  console.log('Bob regId:', b.registrationId);
  console.log('Generated identity keys (POC).');
}

run().catch(console.error);
